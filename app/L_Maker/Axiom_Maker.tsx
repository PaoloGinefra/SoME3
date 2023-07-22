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

import PointSequenceEditor from './Inreface/PointSequenceEditor'

interface Axiom_Maker_State {
    axiom: Symbol[];
    setAxiom: (s: Symbol[]) => void;
}

export default function Axiom_Maker({ axiom, setAxiom }: Axiom_Maker_State) {
    function handleSequence(p: p5, points: p5.Vector[]) {
        setAxiom(GPLS.pointSequence2String(points))
    }

    return (
        <div className={classes['container']}>
            <PointSequenceEditor handleSequence={handleSequence} />
        </div>
    )
}