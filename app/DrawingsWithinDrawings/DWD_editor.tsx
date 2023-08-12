'use client'

import { useState } from 'react'
import { Image, Renderer } from 'p5'
import useStatefulSketch from '../p5/useStatefulSketch'
import SketchRenderer from '../p5/SketchRenderer'
import classes from '../Examples/example-sketch.module.css'

import Grid from '../utils/Grid'

export default function DWD_editor() {
    const sketch = useStatefulSketch({}, (state, p) => {
        const w = 800
        const h = 500

        let bgColor = p.color(251, 234, 205)
        let canvas: Renderer

        let gridSize = 10
        let grid = new Grid(w, h, gridSize, 0.2, 0.1, p);

        p.preload = function () {
            grid.preload()
        }

        p.setup = function () {
            canvas = p.createCanvas(w, h)
            grid.setup()
        }

        p.draw = function () {
            p.background(bgColor)
            grid.draw()
        }

    })

    return (
        <div className={classes['container']}>
            <SketchRenderer sketch={sketch} />
        </div>
    )
}
