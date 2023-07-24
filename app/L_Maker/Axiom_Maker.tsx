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
import type { Point } from './Inreface/PointSequenceEditor'

interface Axiom_Maker_State {
    axiom: Symbol[];
    setAxiom: (s: Symbol[]) => void;
    alphabet: string;
    startingAxiom: Symbol[];
}

export default function Axiom_Maker({ axiom, setAxiom, alphabet, startingAxiom }: Axiom_Maker_State) {

    function handleSequence(points: Point[]) {
        setAxiom(GPLS.pointSequence2String(points))
    }

    return (
        <div className={classes['container']}>
            <h1>Axiom Editor</h1>
            <PointSequenceEditor string={startingAxiom} handleSequence={handleSequence} alphabet={alphabet} />
        </div>
    )
}