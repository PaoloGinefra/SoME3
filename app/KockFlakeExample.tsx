'use client'

import { useState } from 'react'
import { Image, Renderer } from 'p5'

import useStatefulSketch from './p5/useStatefulSketch'
import SketchRenderer from './p5/SketchRenderer'

import classes from './example-sketch.module.css'

import GPLS from './GPLS/GPLS'
import { Symbol, Production, DrawingRule, LSystem } from './GPLS/GPLS_interfaces'

let KochFlake_LSys : LSystem = {
    axiom: [
        {char: "F", params: [400]},
        // {char: "+", params: []},
        // {char: "+", params: []},
        // {char: "F", params: [400]},
        // {char: "+", params: []},
        // {char: "+", params: []},
        // {char: "F", params: [400]},

    ],
    productions: [
        {
            preChar: "F",
            condition: (params) => true,
            successor: (params) => [
                {char: "(", params: []},
                {char: "F", params: [params[0]/3]},
                {char: "-", params: []},
                {char: "F", params: [params[0]/3]},
                {char: "+", params: []},
                {char: "+", params: []},
                {char: "F", params: [params[0]/3]},
                {char: "-", params: []},
                {char: "F", params: [params[0]/3]},
                {char: ")", params: []},

            ]
        },
    ]
    ,
    drawingRules: [
        {
            targetChar: "F",
            drawing: (params, p, t = 1) => {
                let k = params[0] * 3 / 2;
                let l = k /(1 + Math.cos(p.PI/3 * t))
                l = params[0];
                p.line(0, 0, l, 0);
                p.translate(l, 0);
            }
        },
        {
            targetChar: "+",
            drawing: (params, p, t : number = 1) => {
                p.rotate(p.PI/3 * t);
            }
        },
        {
            targetChar: "-",
            drawing: (params, p, t : number = 1) => {
                p.rotate(-p.PI/3 * t);
            }
        }
    ]
}

export default function KochFlake() {
  const sketch = useStatefulSketch({}, (state, p) => {
    const w = 700
    const h = 550

    let canvas: Renderer

    let t = 0;

    let String : Symbol[] = KochFlake_LSys.axiom

    p.setup = function () {
      canvas = p.createCanvas(w, h)
      p.background(251, 234, 205)
      p.translate(50, h/2)
      GPLS.drawString(p, String, KochFlake_LSys.drawingRules);

      canvas.mouseClicked(function () {
        String = GPLS.applyProductions(String, KochFlake_LSys.productions);
        //GPLS.printString(String);
        t = 0;

      })

      canvas.mouseOut(function () {
        String = KochFlake_LSys.axiom;
        p.background(251, 234, 205)
        p.translate(50, 150)

        GPLS.drawString(p, String, KochFlake_LSys.drawingRules);
      })
    }

    p.draw = function () {
        p.background(251, 234, 205)
        p.translate(50, h-50)
        p.push()
        GPLS.drawString(p, String, KochFlake_LSys.drawingRules, t);
        p.pop()

        t += p.deltaTime/1000 / (0.5);
    }

  })

  return (
    <div className={classes['container']}>
      <SketchRenderer sketch={sketch} />
    </div>
  )
}
