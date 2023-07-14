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
        {char: "F", params: [400, 0]},
        {char: "+", params: []},
        {char: "+", params: []},
        {char: "F", params: [400, 0]},
        {char: "+", params: []},
        {char: "+", params: []},
        {char: "F", params: [400, 0]},

    ],
    productions: [
        {
            preChar: "F",
            condition: (params) => true,
            successor: (params) => [
                {char: "F", params: [params[0]/3, params[1]/3]},
                {char: "-", params: []},
                {char: "F", params: [params[0]/3, params[1]/3]},
                {char: "+", params: []},
                {char: "+", params: []},
                {char: "F", params: [params[0]/3, params[1]/3]},
                {char: "-", params: []},
                {char: "F", params: [params[0]/3, params[1]/3]},
            ]
        },
    ]
    ,
    drawingRules: [
        {
            targetChar: "F",
            drawing: (params, p) => {
                p.line(0, 0, params[0], params[1]);
                p.translate(params[0], params[1]);
                p.ellipse(0, 0, params[2], params[2]);
            }
        },
        {
            targetChar: "+",
            drawing: (params, p) => {
                p.rotate(p.PI/3);
            }
        },
        {
            targetChar: "-",
            drawing: (params, p) => {
                p.rotate(-p.PI/3);
            }
        }
    ]
}

export default function KochFlake() {
  const sketch = useStatefulSketch({}, (state, p) => {
    const w = 500
    const h = 550

    let canvas: Renderer
    let img: Image

    let String : Symbol[] = KochFlake_LSys.axiom

    p.setup = function () {
      canvas = p.createCanvas(w, h)
      p.background(251, 234, 205)
      p.translate(50, 150)
      GPLS.drawString(p, String, KochFlake_LSys.drawingRules);

      canvas.mouseClicked(function () {
        String = GPLS.applyProductions(String, KochFlake_LSys.productions);
        //GPLS.printString(String);

        p.background(251, 234, 205)
        p.translate(50, 150)
        p.push()
        GPLS.drawString(p, String, KochFlake_LSys.drawingRules);
        p.pop()
      })

      canvas.mouseOut(function () {
        String = KochFlake_LSys.axiom;
        p.background(251, 234, 205)
        p.translate(50, 150)
        GPLS.drawString(p, String, KochFlake_LSys.drawingRules);
      })
    }

    p.draw = function () {
    }

  })

  return (
    <div className={classes['container']}>
      <SketchRenderer sketch={sketch} />
    </div>
  )
}
