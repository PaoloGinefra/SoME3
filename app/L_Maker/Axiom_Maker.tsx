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
    mode: string;
    setMode: (s: string) => void;
    char: string;
    setChar: (s: string) => void;
}

export default function Axiom_Maker({ axiom, setAxiom, alphabet, startingAxiom, mode, setMode, char, setChar }: Axiom_Maker_State) {

    function handleSequence(points: Point[]) {
        setAxiom(GPLS.pointSequence2String(points))
    }

    return (
        <div className='flex flex-col gap-2 max-w-40vw'>
            <h1 className='m-auto text-4xl'>Axiom</h1>
            <PointSequenceEditor char={char} setChar={setChar} mode={mode} setMode={setMode} string={[]} handleSequence={handleSequence} alphabet={alphabet} referenceToggle={false} />
        </div>
    )
}