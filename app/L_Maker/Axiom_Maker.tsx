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

        const modesFunctions: any = {
            'MouseClick': {
                'Add': () => {
                    points.push(p.createVector(quantizeCoord(p.mouseX), quantizeCoord(p.mouseY)))
                    let s = GPLS.pointSequence2String(points)
                    setAxiom(s);
                },
            },
            'Draw': {
                'Clear': () => {
                    points = []
                    setAxiom([])
                }
            }
        }


        function quantizeCoord(x: number) {
            return Math.round(x / gridSize) * gridSize;
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
        }

        p.draw = function () {
            p.background(251, 234, 205)
            grid.draw()

            if (state.current.mode in modesFunctions['Draw'])
                modesFunctions['Draw'][state.current.mode]();


            //draw lines between points
            p.strokeWeight(gridSize / 2)
            p.stroke(0, 0, 0, 100)
            for (let i = 0; i < points.length - 1; i++) {
                p.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
            }

            if (p.mouseX > 0 && p.mouseX < w && p.mouseY > 0 && p.mouseY < h && points.length > 0) {
                //draw faded line between last point and mouse
                p.line(points[points.length - 1].x, points[points.length - 1].y, quantizeCoord(p.mouseX), quantizeCoord(p.mouseY))
            }


            //draw all points
            p.strokeWeight(gridSize)
            p.stroke(pointColor)
            points.forEach(point => {
                p.circle(point.x, point.y, gridSize)
            })

            if (p.mouseX > 0 && p.mouseX < w && p.mouseY > 0 && p.mouseY < h) {
                //draw faded point at mouse
                p.circle(quantizeCoord(p.mouseX), quantizeCoord(p.mouseY), gridSize)
            }
        }
    })

    return (
        <div className={classes['container']}>
            <SketchRenderer sketch={sketch} />
            <ModeButton mode={mode} setMode={setMode} />
        </div>
    )
}