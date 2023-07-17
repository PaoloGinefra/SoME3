'use client'

import { useState } from 'react'
import { Image, Renderer } from 'p5'

import useStatefulSketch from './p5/useStatefulSketch'
import SketchRenderer from './p5/SketchRenderer'

import classes from './example-sketch.module.css'
import type p5 from 'p5'

import GPLS from './GPLS/GPLS'
import { Symbol, Production, DrawingRule, LSystem } from './GPLS/GPLS_interfaces'

import Grid from './utils/Grid'

let SierpiskiTriangle_LSys: LSystem = {
    axiom: [
        { char: "A", params: [400] },
    ],
    productions: [
        {
            preChar: "A",
            condition: (params) => true,
            successor: (params) => [
                { char: "(", params: [] },
                { char: "B", params: [params[0] / 2] },
                { char: "+", params: [] },
                { char: "A", params: [params[0] / 2] },
                { char: "+", params: [] },
                { char: "B", params: [params[0] / 2] },
                { char: ")", params: [] },

            ]
        },
        {
            preChar: "B",
            condition: (params) => true,
            successor: (params) => [
                { char: "(", params: [] },
                { char: "A", params: [params[0] / 2] },
                { char: "-", params: [] },
                { char: "B", params: [params[0] / 2] },
                { char: "-", params: [] },
                { char: "A", params: [params[0] / 2] },
                { char: ")", params: [] },

            ]
        },
    ]
    ,
    drawingRules: [
        {
            targetChars: "AB",
            drawing: (params, p, t = 1) => {
                let k = params[0] * 3 / 2;
                let l = k / (1 + Math.cos(p.PI / 3 * t))
                l = params[0];
                p.stroke('#0070A9')
                p.strokeWeight(1);
                p.line(0, 0, l, 0);
                p.translate(l, 0);
            }
        },
        {
            targetChars: "+",
            drawing: (params, p, t: number = 1) => {
                p.rotate(p.PI / 3 * t);
            }
        },
        {
            targetChars: "-",
            drawing: (params, p, t: number = 1) => {
                p.rotate(-p.PI / 3 * t);
            }
        }
    ]
}

export default function SierpinskiTriangle() {
    const sketch = useStatefulSketch({}, (state, p) => {
        const w = 700
        const h = 550

        let canvas: Renderer

        let t = 0;

        let String: Symbol[] = SierpiskiTriangle_LSys.axiom

        let grid = new Grid(w, h, 20, 0.2, 0.1, p);

        p.preload = function () {
            grid.preload();
        }

        p.setup = function () {
            canvas = p.createCanvas(w, h)
            grid.setup();
            p.background(251, 234, 205)
            p.translate(50, h / 2)
            GPLS.drawString(p, String, SierpiskiTriangle_LSys.drawingRules);

            canvas.mouseClicked(function () {
                String = GPLS.applyProductions(String, SierpiskiTriangle_LSys.productions);
                String = GPLS.applyProductions(String, SierpiskiTriangle_LSys.productions);
                //GPLS.printString(String);
                t = 0;

            })

            canvas.mouseOut(function () {
                String = SierpiskiTriangle_LSys.axiom;
                p.background(251, 234, 205)
                p.translate(50, 150)

                GPLS.drawString(p, String, SierpiskiTriangle_LSys.drawingRules);
            })
        }

        p.draw = function () {
            p.background(251, 234, 205)
            grid.draw();
            p.translate(50, h - 50)
            p.push()
            GPLS.drawString(p, String, SierpiskiTriangle_LSys.drawingRules, t);
            p.pop()

            t += p.deltaTime / 1000 / (0.5);
        }

    })

    return (
        <div className={classes['container']}>
            <SketchRenderer sketch={sketch} />
        </div>
    )
}
