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

interface Axiom_Maker_State {
    axiom: Symbol[];
    setAxiom: (s: Symbol[]) => void;
}

export default function Axiom_Maker({ axiom, setAxiom }: Axiom_Maker_State) {
    const sketch = useStatefulSketch({ axiom }, (state, p) => {
        const w = 800
        const h = 500
        const gridSize = 10

        let canvas: Renderer
        let grid = new Grid(w, h, gridSize, 0.2, 0.1, p);

        let startingPoint: p5.Vector = p.createVector(w / 2, h / 2);
        let points: p5.Vector[] = [startingPoint];

        let pointColor = p.color('#4b8b2f60');

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
                points.push(p.createVector(quantizeCoord(p.mouseX), quantizeCoord(p.mouseY)))
                let s = GPLS.pointSequence2String(points)
                setAxiom(s);
                GPLS.printString(state.current.axiom);
            })
        }

        p.draw = function () {
            p.background(251, 234, 205)
            grid.draw()


            //draw lines between points
            p.strokeWeight(gridSize / 2)
            p.stroke(0, 0, 0, 100)
            for (let i = 0; i < points.length - 1; i++) {
                p.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
            }

            if (p.mouseX > 0 && p.mouseX < w && p.mouseY > 0 && p.mouseY < h) {
                //draw faded line between last point and mouse
                p.line(points[points.length - 1].x, points[points.length - 1].y, quantizeCoord(p.mouseX), quantizeCoord(p.mouseY))
            }

            //draw starting position as a square
            p.fill(0)
            p.rectMode(p.CENTER)
            p.fill(pointColor)
            p.strokeWeight(0)
            p.square(startingPoint.x, startingPoint.y, 10)

            //draw all points
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
        </div>
    )
}