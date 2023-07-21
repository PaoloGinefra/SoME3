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

interface L_Renderer_State {
    string: Symbol[];
    drawingRules: DrawingRule[];
}

export default function L_Renderer({ string, drawingRules }: L_Renderer_State) {
    const sketch = useStatefulSketch({ string, drawingRules }, (state, p) => {
        const w = 800
        const h = 500
        const gridSize = 10

        let canvas: Renderer
        let grid = new Grid(w, h, gridSize, 0.2, 0.1, p);

        let startingPoint: p5.Vector = p.createVector(w / 2, h / 2);

        p.preload = function () {
            grid.preload()
        }

        p.setup = function () {
            canvas = p.createCanvas(w, h)
            grid.setup()
        }

        p.draw = function () {
            p.background(251, 234, 205)
            grid.draw()
            p.translate(startingPoint.x, startingPoint.y);
            GPLS.drawString(p, state.current.string, drawingRules);
        }
    })

    return (
        <div className={classes['container']}>
            <SketchRenderer sketch={sketch} />
        </div>
    )
}