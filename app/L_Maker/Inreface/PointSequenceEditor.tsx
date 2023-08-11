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

import CharPicker from './CharPicker'

interface PointSequenceEditor_State {
    string: Symbol[];
    handleSequence: (s: Point[]) => void;
    alphabet: string;
    preChar?: string;
}

export interface Point {
    position: p5.Vector;
    push: boolean;
    pop: boolean;
    char: string;
}

export default function PointSequenceEditor({ string, handleSequence, alphabet, preChar }: PointSequenceEditor_State) {
    const [mode, setMode] = useState<string>('Move');
    const [char, setChar] = useState<string>('F');

    const sketch = useStatefulSketch({ handleSequence, mode, string, char, alphabet, preChar }, (state, p) => {
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

        let pastString: Symbol[] = [];
        const modesFunctions: any = {
            'MouseClick': {
                'Add': () => {
                    points.push(
                        {
                            position: p.createVector(quantizeCoord(p.mouseX - offset.x), quantizeCoord(p.mouseY - offset.y)),
                            push: false,
                            pop: false,
                            char: state.current.preChar ?? 'F'
                        }
                    )
                    handleSequence(points);
                },
                'Delete': () => {
                    let id = getPointIdFromMouse()
                    console.log(id)
                    if (id != -1) {
                        points.splice(id, 1)
                        handleSequence(points);
                    }
                },
                'Stack push': () => {
                    let id = getPointIdFromMouse()
                    if (id != -1) {
                        points[id].push = !points[id].push
                        handleSequence(points);
                        setMode('Stack pop')
                    }
                },
                'Stack pop': () => {
                    let id = getPointIdFromMouse()
                    if (id != -1) {
                        points[id].pop = !points[id].pop
                        handleSequence(points);
                        setMode('Stack push')
                    }
                },
                'Color': () => {
                    let id = getPointIdFromMouse()
                    if (id != -1) {
                        points[id].char = state.current.char
                        handleSequence(points);
                    }
                }
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
                    handleSequence(points);
                    offset = p.createVector(0, 0)
                    setMode('Add')
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
                        handleSequence(points);
                    }
                },
            }
        }


        function quantizeCoord(x: number) {
            return Math.round(x / gridSize) * gridSize;
        }

        function getPointIdFromMouse() {
            return points.findIndex(point => p.abs(point.position.x - quantizeCoord(p.mouseX - offset.x)) < gridSize / 2 && p.abs(point.position.y - quantizeCoord(p.mouseY - offset.y)) < gridSize / 2)
        }

        p.preload = function () {
            grid.preload()
        }

        p.setup = function () {
            points = GPLS.String2PointSequence(p, state.current.string, p.createVector(w / 2, h / 2), state.current.alphabet);
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

        function drawArrow(p: p5, p1: p5.Vector, p2: p5.Vector, dir: p5.Vector, percent: number) {
            let point = p2.copy().lerp(p1, percent)
            let angle = p.PI / 3
            let dirCopy = dir.copy()
            //draw arrow
            p.strokeWeight(gridSize / 4)
            p.stroke(0, 0, 0, 100)
            dirCopy.rotate(-angle)
            p.line(point.x, point.y, point.x + dirCopy.y, point.y - dirCopy.x)
            dirCopy.rotate(2 * angle)
            p.line(point.x, point.y, point.x - dirCopy.y, point.y + dirCopy.x)

        }

        function drawLine(p: p5, p1: p5.Vector, p2: p5.Vector, char: string) {
            p.strokeWeight(gridSize / 2)
            p.stroke(0, 0, 0, 100)
            p.line(p2.x, p2.y, p1.x, p1.y)
            let dir = p2.copy().sub(p1).normalize().mult(gridSize / 2)

            drawArrow(p, p1, p2, dir, 0.2)

            let point = p2.copy().lerp(p1, 0.5)
            p.textAlign(p.CENTER, p.CENTER)
            p.textSize(gridSize)
            p.fill(0, 0, 0, 255)
            p.noStroke()
            p.textStyle(p.BOLD)
            p.text(char, point.x, point.y)
        }

        function drawPoint(p: p5, point: Point) {
            if (point.push) {
                drawPush(p, point);
            }
            if (point.pop) {
                drawPop(p, point);
            }

            drawCircle(p, point)

            p.textAlign(p.CENTER, p.CENTER)
            p.textSize(gridSize)
            p.fill(0, 0, 0, 255)
            p.noStroke()
            p.text('+', point.position.x, point.position.y)
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
            if (JSON.stringify(state.current.string) != JSON.stringify(pastString)) {
                console.log('preChar changed')
                points = GPLS.String2PointSequence(p, state.current.string, p.createVector(w / 2, h / 2), state.current.alphabet);
            }
            p.background(251, 234, 205)
            grid.draw(offset, scale)

            p.translate(offset.x, offset.y)
            p.scale(scale)

            if (state.current.mode in modesFunctions['Draw'])
                modesFunctions['Draw'][state.current.mode]();

            if (points.length != 0) {
                //draw lines between points
                let Stack: p5.Vector[] = []

                if (points[0].push)
                    Stack.push(points[0].position)

                if (points[0].pop)
                    Stack.pop()


                for (let i = 1; i < points.length; i++) {
                    p.strokeWeight(gridSize / 2)
                    p.stroke(0, 0, 0, 100)

                    if (points[i - 1].pop) {
                        let p1 = Stack.pop() ?? p.createVector(0, 0);
                        let p2 = points[i].position
                        drawLine(p, p1, p2, points[i].char)
                    }
                    else {
                        drawLine(p, points[i - 1].position, points[i].position, points[i].char)
                    }
                    drawPoint(p, points[i - 1])

                    if (points[i].push) {
                        Stack.push(points[i].position)
                    }
                }
            }

            if (p.mouseX > 0 && p.mouseX < w && p.mouseY > 0 && p.mouseY < h && points.length > 0 && state.current.mode == 'Add') {
                //draw faded line between last point and mouse
                drawLine(p, points[points.length - 1].position, p.createVector(quantizeCoord(p.mouseX - offset.x), quantizeCoord(p.mouseY - offset.y)), state.current.preChar ?? '')
            }
            if (points.length > 0)
                drawPoint(p, points[points.length - 1])

            p.strokeWeight(gridSize)


            if (p.mouseX > 0 && p.mouseX < w && p.mouseY > 0 && p.mouseY < h) {
                if (state.current.mode == 'Add' || state.current.mode == 'Delete' || state.current.mode == 'Edit') {
                    p.fill(255, 255, 255)
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
                    drawPush(p, { position: p.createVector(quantizeCoord(p.mouseX - offset.x), quantizeCoord(p.mouseY - offset.y)), push: true, pop: false, char: 'F' })
                }
                else if (state.current.mode == 'Stack pop') {
                    drawPop(p, { position: p.createVector(quantizeCoord(p.mouseX - offset.x), quantizeCoord(p.mouseY - offset.y)), push: false, pop: true, char: 'F' })
                }
                else if (state.current.mode == 'Color') {
                    p.textAlign(p.CENTER, p.CENTER)
                    p.textSize(gridSize)
                    p.fill(0, 0, 0, 255)
                    p.noStroke()
                    p.text(state.current.char ?? '', quantizeCoord(p.mouseX - offset.x), quantizeCoord(p.mouseY - offset.y))
                }
            }
            pastString = [...state.current.string];
        }

    })

    return (
        <div className={classes['container']}>
            <ModeButton mode={mode} setMode={setMode} />
            {mode == 'Color' ? <CharPicker alphabet={alphabet} currentChar={char} setcurrentChar={setChar} /> : null}
            <SketchRenderer sketch={sketch} />
        </div>
    )
}