'use client'

import { useState } from 'react'
import { Image, Renderer } from 'p5'

import useStatefulSketch from '../../p5/useStatefulSketch'
import SketchRenderer from '../../p5/SketchRenderer'

import classes from '../../Examples/example-sketch.module.css'

import type p5 from 'p5'
import Grid from '../../utils/Grid'
import GPLS from '../../GPLS/GPLS'
import { Symbol, Production, DrawingRule, LSystem } from "../../GPLS/GPLS_interfaces";

import ModeButton from './ModeButtons'
import Modes from './Modes'

interface PointSequenceEditor_State {
    string: Symbol[];
    handleSequence: (p: p5, s: Point[]) => void;
}

export interface Point {
    position: p5.Vector;
    push: boolean;
    pop: boolean;
}

export default function PointSequenceEditor({ string, handleSequence }: PointSequenceEditor_State) {
    const [mode, setMode] = useState<string>('Move');

    const sketch = useStatefulSketch({ handleSequence, mode, string }, (state, p) => {
        const w = 800
        const h = 500
        const gridSize = 10

        let canvas: Renderer
        let grid = new Grid(w, h, gridSize, 0.2, 0.1, p);

        let points: Point[] = [];

        let pointColor = p.color('#4b8b2f60');
        let deletePointColor = p.color('#a53f3f60');
        let editColor = p.color('#a3c6c260');

        let touchPoint = p.createVector(0, 0)
        let isHolding = false

        let selected = -1

        let offset = p.createVector(0, 0)
        let scale = 1

        const modesFunctions: any = {
            'MouseClick': {
                'Add': () => {
                    points.push(
                        {
                            position: p.createVector(quantizeCoord(p.mouseX - offset.x), quantizeCoord(p.mouseY - offset.y)),
                            push: false,
                            pop: false
                        }
                    )
                    handleSequence(p, points);
                },
                'Delete': () => {
                    let id = getPointIdFromMouse()
                    console.log(id)
                    if (id != -1) {
                        points.splice(id, 1)
                        handleSequence(p, points);
                    }
                },
                'Stack push': () => {
                    let id = getPointIdFromMouse()
                    if (id != -1) {
                        points[id].push = !points[id].push
                        handleSequence(p, points);
                        setMode('Stack pop')
                    }
                },
                'Stack pop': () => {
                    let id = getPointIdFromMouse()
                    if (id != -1) {
                        points[id].pop = !points[id].pop
                        handleSequence(p, points);
                        setMode('Stack push')
                    }
                },
            },
            'MouseReleased': {
                'Move': () => {
                    isHolding = false
                },
                'Edit': () => {
                    selected = -1
                }
            },
            'MousePressed': {
                'Move': () => {
                    touchPoint = p.createVector(p.mouseX, p.mouseY)
                    isHolding = true
                },
                'Edit': () => {
                    let id = getPointIdFromMouse();
                    if (id != -1) {
                        selected = id
                    }
                }
            },
            'MouseOut': {
                'Move': () => {
                    isHolding = false
                },
                'Edit': () => {
                    selected = -1
                }
            },
            'Draw': {
                'Clear': () => {
                    points = []
                    handleSequence(p, points);
                    offset = p.createVector(0, 0)
                },
                'Move': () => {
                    if (isHolding) {
                        offset.add(p.createVector(p.mouseX, p.mouseY).sub(touchPoint))
                        touchPoint = p.createVector(p.mouseX, p.mouseY)
                        localStorage.setItem('offset', JSON.stringify(offset))
                    }
                },
                'Edit': () => {
                    if (selected != -1) {
                        points[selected].position = p.createVector(quantizeCoord(p.mouseX - offset.x), quantizeCoord(p.mouseY - offset.y))
                        handleSequence(p, points);
                    }
                },
            }
        }


        function quantizeCoord(x: number) {
            return Math.round(x / gridSize) * gridSize;
        }

        function getPointIdFromMouse() {
            return points.findIndex(point => p.abs(point.position.x - quantizeCoord(p.mouseX - offset.x)) < 0.2 && p.abs(point.position.y - quantizeCoord(p.mouseY - offset.y)) < 0.2)
        }

        p.preload = function () {
            grid.preload()
        }

        p.setup = function () {
            points = GPLS.String2PointSequence(p, state.current.string, p.createVector(w / 2, h / 2));
            console.log('Setup', points)
            canvas = p.createCanvas(w, h)
            grid.setup()

            canvas.mouseClicked(function () {
                if (state.current.mode in modesFunctions['MouseClick'])
                    modesFunctions['MouseClick'][state.current.mode]();
            })

            canvas.mousePressed(function () {
                if (state.current.mode in modesFunctions['MousePressed'])
                    modesFunctions['MousePressed'][state.current.mode]();
            })

            canvas.mouseReleased(function () {
                if (state.current.mode in modesFunctions['MouseReleased'])
                    modesFunctions['MouseReleased'][state.current.mode]();
            })

            canvas.mouseOut(function () {
                if (state.current.mode in modesFunctions['MouseOut'])
                    modesFunctions['MouseOut'][state.current.mode]();
            })
        }

        function drawLine(p: p5, p1: p5.Vector, p2: p5.Vector) {
            p.strokeWeight(gridSize / 2)
            p.stroke(0, 0, 0, 100)
            p.line(p2.x, p2.y, p1.x, p1.y)
            let point = p2.copy().lerp(p1, 0.5)
            let dir = p2.copy().sub(p1).normalize().mult(gridSize / 2)
            let angle = p.PI / 3
            //draw arrow
            p.strokeWeight(gridSize / 4)
            p.stroke(0, 0, 0, 100)
            dir.rotate(-angle)
            p.line(point.x, point.y, point.x + dir.y, point.y - dir.x)
            dir.rotate(2 * angle)
            p.line(point.x, point.y, point.x - dir.y, point.y + dir.x)
        }

        function drawPoint(p: p5, point: Point) {
            if (point.push) {
                drawPush(p, point);
            }
            if (point.pop) {
                drawPop(p, point);
            }

            drawCircle(p, point)
        }


        function drawCircle(p: p5, point: Point) {
            p.fill(255, 255, 255)
            p.strokeWeight(gridSize)
            p.stroke(pointColor)
            p.circle(point.position.x, point.position.y, gridSize)
        }

        function drawPush(p: p5, point: Point) {
            p.stroke(0, 0, 0, 100)
            p.strokeWeight(gridSize / 2)
            p.fill(0, 0, 0, 0)
            p.arc(point.position.x, point.position.y, 2 * gridSize, 2 * gridSize, p.PI / 2, p.PI * 3 / 2)
        }

        function drawPop(p: p5, point: Point) {
            p.stroke(0, 0, 0, 100)
            p.strokeWeight(gridSize / 2)
            p.fill(0, 0, 0, 0)
            p.arc(point.position.x, point.position.y, 2 * gridSize, 2 * gridSize, p.PI * 3 / 2, p.PI / 2)
        }


        p.draw = function () {
            p.background(251, 234, 205)
            grid.draw(offset, scale)

            p.translate(offset.x, offset.y)
            p.scale(scale)

            if (state.current.mode in modesFunctions['Draw'])
                modesFunctions['Draw'][state.current.mode]();

            if (points.length != 0) {
                //draw lines between points
                let Stack: p5.Vector[] = []
                for (let i = 1; i < points.length; i++) {
                    p.strokeWeight(gridSize / 2)
                    p.stroke(0, 0, 0, 100)

                    if (points[i - 1].pop) {
                        let p1 = Stack.pop() ?? p.createVector(0, 0);
                        let p2 = points[i].position
                        drawLine(p, p1, p2)
                    }
                    else {
                        drawLine(p, points[i - 1].position, points[i].position)
                    }
                    drawPoint(p, points[i - 1])

                    if (points[i].push) {
                        Stack.push(points[i].position)
                    }
                }
            }

            if (p.mouseX > 0 && p.mouseX < w && p.mouseY > 0 && p.mouseY < h && points.length > 0 && state.current.mode == 'Add') {
                //draw faded line between last point and mouse
                drawLine(p, points[points.length - 1].position, p.createVector(quantizeCoord(p.mouseX - offset.x), quantizeCoord(p.mouseY - offset.y)))
            }
            if (points.length > 0)
                drawPoint(p, points[points.length - 1])

            p.strokeWeight(gridSize)


            if (p.mouseX > 0 && p.mouseX < w && p.mouseY > 0 && p.mouseY < h) {
                if (state.current.mode == 'Add' || state.current.mode == 'Delete' || state.current.mode == 'Edit') {
                    //draw faded point at mouse
                    if (state.current.mode == 'Delete')
                        p.stroke(deletePointColor)
                    else if (state.current.mode == 'Edit')
                        p.stroke(editColor)
                    else
                        p.stroke(pointColor)
                    //draw faded point at mouse
                    p.circle(quantizeCoord(p.mouseX - offset.x), quantizeCoord(p.mouseY - offset.y), gridSize)
                }
                else if (state.current.mode == 'Stack push') {
                    drawPush(p, { position: p.createVector(quantizeCoord(p.mouseX - offset.x), quantizeCoord(p.mouseY - offset.y)), push: true, pop: false })
                }
                else if (state.current.mode == 'Stack pop') {
                    drawPop(p, { position: p.createVector(quantizeCoord(p.mouseX - offset.x), quantizeCoord(p.mouseY - offset.y)), push: false, pop: true })
                }
            }
        }
    })

    return (
        <div className={classes['container']}>
            <ModeButton mode={mode} setMode={setMode} />
            <SketchRenderer sketch={sketch} />
        </div>
    )
}