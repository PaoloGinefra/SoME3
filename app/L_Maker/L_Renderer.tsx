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
import { off } from 'process'

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
        let offset = p.createVector(0, 0)
        let scale = 1

        let touchPoint = p.createVector(0, 0)
        let isHolding = false;

        p.preload = function () {
            grid.preload()
        }

        p.setup = function () {
            canvas = p.createCanvas(w, h)
            grid.setup()

            canvas.mousePressed(() => {
                touchPoint = p.createVector(p.mouseX, p.mouseY)
                isHolding = true
            })

            canvas.mouseReleased(() => {
                isHolding = false
            })

            canvas.mouseOut(() => {
                isHolding = false
            })
        }

        p.draw = function () {
            p.background(251, 234, 205)
            if (isHolding) {
                offset.add(p.createVector(p.mouseX - touchPoint.x, p.mouseY - touchPoint.y))
                touchPoint = p.createVector(p.mouseX, p.mouseY)
            }
            grid.draw(offset, scale)
            p.translate(startingPoint.x + offset.x, startingPoint.y + offset.y);
            p.push()
            GPLS.drawString(p, state.current.string, drawingRules);
            p.pop()
        }
    })

    return (
        <div className={classes['container']}>
            <h1>Rendered L-System</h1>
            <SketchRenderer sketch={sketch} />
        </div>
    )
}