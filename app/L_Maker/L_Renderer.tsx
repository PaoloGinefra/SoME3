'use client'

import { useRef, useState } from 'react'
import { Image, Renderer } from 'p5'

import useStatefulSketch from '../p5/useStatefulSketch'
import SketchRenderer from '../p5/SketchRenderer'

import classes from '../Examples/example-sketch.module.css'

import type p5 from 'p5'
import Grid from '../utils/Grid'
import GPLS from '../GPLS/GPLS'
import { Symbol, Production, DrawingRule, LSystem } from "../GPLS/GPLS_interfaces";
import { off } from 'process'
import { stat } from 'fs/promises'

interface L_Renderer_State {
    string: Symbol[];
    drawingRules: DrawingRule[];
    iteration: number;
    setIteration: (n: number) => void;
}

export default function L_Renderer({ string, drawingRules, iteration, setIteration }: L_Renderer_State) {
    const t = useRef(0);

    const sketch = useStatefulSketch({ string, drawingRules, t }, (state, p) => {
        let w = p.windowWidth * 0.8
        let h = 500
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
            grid.draw(offset.copy().mult(2), scale)
            p.translate(startingPoint.x + offset.x, startingPoint.y + offset.y);
            p.push()
            GPLS.drawString(p, state.current.string, drawingRules, t.current, true, 1 / state.current.string.length, 0.5);

            p.pop()

            t.current = t.current + p.deltaTime / 1000
        }

        p.windowResized = function () {
            w = p.windowWidth * 0.8
            p.resizeCanvas(w, h)
        }
    })

    return (
        <div className='flex flex-col justify-center m-auto mt-2'>
            <h1 className='text-4xl m-auto'>Result</h1>
            <div className='m-auto'>

                <SketchRenderer sketch={sketch} />
            </div>
            <div className='flex justify-center mt-2 gap-8'>
                <div className='flex flex-col'>
                    <input
                        className='m-auto w-40 h-6'
                        id="sizeSlider"
                        type="range"
                        min={0}
                        max={8}
                        value={iteration}
                        onChange={(e) => setIteration(parseInt(e.target.value))}
                    />
                    <label className='m-auto' htmlFor="sizeSlider">Iterations: {iteration}</label>
                </div>
                <button className='px-2' onClick={() => { t.current = 0 }}>Animate</button>
            </div>
        </div >
    )
}