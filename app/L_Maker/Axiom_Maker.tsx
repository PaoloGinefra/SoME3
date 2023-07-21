'use client'

import { useState } from 'react'
import { Image, Renderer } from 'p5'

import useStatefulSketch from '../p5/useStatefulSketch'
import SketchRenderer from '../p5/SketchRenderer'

import classes from '../Examples/example-sketch.module.css'

import type p5 from 'p5'
import Grid from '../utils/Grid'
import GPLS from '../GPLS/GPLS'
import { Symbol, Production, DrawingRule, LSystem } from "../GPLS/GPLS_interfaces";

import ModeButton from './Inreface/ModeButtons'
import Modes from './Inreface/Modes'
import { stat } from 'fs'

interface Axiom_Maker_State {
    axiom: Symbol[];
    setAxiom: (s: Symbol[]) => void;
}

export default function Axiom_Maker({ axiom, setAxiom }: Axiom_Maker_State) {
    const [mode, setMode] = useState<string>('Move');

    const sketch = useStatefulSketch({ axiom, mode }, (state, p) => {
        const w = 800
        const h = 500
        const gridSize = 10

        let canvas: Renderer
        let grid = new Grid(w, h, gridSize, 0.2, 0.1, p);

        let points: p5.Vector[] = [];

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
                    points.push(p.createVector(quantizeCoord(p.mouseX - offset.x), quantizeCoord(p.mouseY - offset.y)))
                    let s = GPLS.pointSequence2String(points)
                    setAxiom(s);
                },
                'Delete': () => {
                    let id = getPointIdFromMouse()
                    console.log(id)
                    if (id != -1) {
                        points.splice(id, 1)
                        let s = GPLS.pointSequence2String(points)
                        setAxiom(s);
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
                    setAxiom([])
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
                        points[selected] = p.createVector(quantizeCoord(p.mouseX - offset.x), quantizeCoord(p.mouseY - offset.y))
                        let s = GPLS.pointSequence2String(points)
                        setAxiom(s);
                    }
                },
            }
        }


        function quantizeCoord(x: number) {
            return Math.round(x / gridSize) * gridSize;
        }

        function getPointIdFromMouse() {
            return points.findIndex(point => point.x == quantizeCoord(p.mouseX - offset.x) && point.y == quantizeCoord(p.mouseY - offset.y))
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
            for (let i = 0; i < points.length - 1; i++) {
                p.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
            }

            if (p.mouseX > 0 && p.mouseX < w && p.mouseY > 0 && p.mouseY < h && points.length > 0 && state.current.mode == 'Add') {
                //draw faded line between last point and mouse
                p.line(points[points.length - 1].x, points[points.length - 1].y, quantizeCoord(p.mouseX - offset.x), quantizeCoord(p.mouseY - offset.y))
            }


            //draw all points
            p.strokeWeight(gridSize)
            p.stroke(pointColor)
            points.forEach(point => {
                p.circle(point.x, point.y, gridSize)
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