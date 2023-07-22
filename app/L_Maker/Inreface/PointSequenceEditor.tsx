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
    handleSequence: (p: p5, s: Point[]) => void;
}

export interface Point {
    position: p5.Vector;
    push: boolean;
    pop: boolean;
}

export default function PointSequenceEditor({ handleSequence }: PointSequenceEditor_State) {
    const [mode, setMode] = useState<string>('Move');

    const sketch = useStatefulSketch({ handleSequence, mode }, (state, p) => {
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
                    }
                },
                'Stack pop': () => {
                    let id = getPointIdFromMouse()
                    if (id != -1) {
                        points[id].pop = !points[id].pop
                        handleSequence(p, points);
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
            return points.findIndex(point => point.position.x == quantizeCoord(p.mouseX - offset.x) && point.position.y == quantizeCoord(p.mouseY - offset.y))
        }

        p.preload = function () {
            grid.preload()
        }

        p.setup = function () {
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

        p.draw = function () {
            p.background(251, 234, 205)
            grid.draw(offset, scale)

            p.translate(offset.x, offset.y)
            p.scale(scale)

            if (state.current.mode in modesFunctions['Draw'])
                modesFunctions['Draw'][state.current.mode]();


            //draw lines between points
            p.strokeWeight(gridSize / 2)
            p.stroke(0, 0, 0, 100)
            let Stack: p5.Vector[] = []
            for (let i = 1; i < points.length; i++) {
                if (points[i].push) {
                    Stack.push(points[i].position)
                }
                if (points[i - 1].pop) {
                    let p1 = Stack.pop() ?? p.createVector(0, 0);
                    let p2 = points[i].position
                    if (p1 != undefined) {
                        p.line(p1.x, p1.y, p2.x, p2.y)
                    }
                }
                else
                    p.line(points[i].position.x, points[i].position.y, points[i - 1].position.x, points[i - 1].position.y)
            }

            if (p.mouseX > 0 && p.mouseX < w && p.mouseY > 0 && p.mouseY < h && points.length > 0 && state.current.mode == 'Add') {
                //draw faded line between last point and mouse
                p.line(points[points.length - 1].position.x, points[points.length - 1].position.y, quantizeCoord(p.mouseX - offset.x), quantizeCoord(p.mouseY - offset.y))
            }


            //draw all points
            points.forEach(point => {
                if (point.push) {
                    p.stroke(0, 0, 0, 100)
                    p.strokeWeight(gridSize / 2)
                    p.arc(point.position.x, point.position.y, 2 * gridSize, 2 * gridSize, p.PI / 2, p.PI * 3 / 2)
                }
                if (point.pop) {
                    p.stroke(0, 0, 0, 100)
                    p.strokeWeight(gridSize / 2)
                    p.arc(point.position.x, point.position.y, 2 * gridSize, 2 * gridSize, p.PI * 3 / 2, p.PI / 2)
                }

                p.strokeWeight(gridSize)
                p.stroke(pointColor)
                p.circle(point.position.x, point.position.y, gridSize)
            })

            //draw faded point at mouse
            if (state.current.mode == 'Delete')
                p.stroke(deletePointColor)
            else if (state.current.mode == 'Edit')
                p.stroke(editColor)

            if (p.mouseX > 0 && p.mouseX < w && p.mouseY > 0 && p.mouseY < h) {
                //draw faded point at mouse
                p.circle(quantizeCoord(p.mouseX - offset.x), quantizeCoord(p.mouseY - offset.y), gridSize)
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