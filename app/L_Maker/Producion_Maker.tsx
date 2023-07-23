'use client'

import { useState } from 'react'
import { Image, Renderer } from 'p5'

import useStatefulSketch from '../p5/useStatefulSketch'
import SketchRenderer from '../p5/SketchRenderer'

import classes from '../Examples/example-sketch.module.css'

import p5 from 'p5'
import Grid from '../utils/Grid'
import GPLS from '../GPLS/GPLS'
import { Symbol, Production, DrawingRule, LSystem } from "../GPLS/GPLS_interfaces";

import PointSequenceEditor from './Inreface/PointSequenceEditor'
import type { Point } from './Inreface/PointSequenceEditor'

interface Production_Maker_State {
    productions: Production[];
    setProductions: (p: Production[]) => void;
}

export default function Production_Maker({ productions, setProductions }: Production_Maker_State) {

    function handleSequence(p: p5, points: Point[]) {
        if (points.length < 2) return;
        const s = GPLS.pointSequence2String(points)
        const len = points.length
        const dist = p.mag(points[0].position.x - points[len - 1].position.x, points[0].position.y - points[len - 1].position.y)
        const heading = points[len - 1].position.copy().sub(points[0].position).heading();
        setProductions([
            {
                preChar: 'F',
                condition: (params: number[]) => true,
                successor: (params: number[]) => {
                    let newString: Symbol[] = []
                    newString.push({
                        char: '+',
                        params: [-heading]
                    })

                    for (let i = 0; i < s.length; i++) {
                        if (s[i].char == 'F') {
                            newString.push({
                                char: 'F',
                                params: [s[i].params[0] * params[0] / dist]
                            })
                        }
                        else {
                            newString.push(s[i])
                        }

                    }
                    return newString
                }
            }
        ])
    }

    return (
        <div className={classes['container']}>
            <h1>Production Editor (F)</h1>
            <PointSequenceEditor string={[]} handleSequence={handleSequence} />
        </div>
    )
}