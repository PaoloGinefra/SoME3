'use client'

import { useState, useEffect } from 'react'
import { Image, Renderer } from 'p5'

import useStatefulSketch from '../p5/useStatefulSketch'
import SketchRenderer from '../p5/SketchRenderer'

import classes from '../Examples/example-sketch.module.css'

import type p5 from 'p5'
import Grid from '../utils/Grid'
import GPLS from '../GPLS/GPLS'
import { Symbol, Production, DrawingRule, LSystem } from "../GPLS/GPLS_interfaces";
import Axiom_Maker from './Axiom_Maker'
import Production_Maker from './Producion_Maker';
import L_Renderer from './L_Renderer'

export default function L_Maker() {
    const [axiom, setAxiom] = useState<Symbol[]>([]);
    const [productions, setProductions] = useState<Production[]>([]);
    const drawingRules: DrawingRule[] = [
        {
            targetChars: 'F',
            drawing: (params: number[], p: p5, t?: number) => {
                p.stroke(0, 0, 0, 255);
                p.strokeWeight(1);
                p.line(0, 0, params[0], 0);
                p.translate(params[0], 0);
            }
        },
        {
            targetChars: '+',
            drawing: (params: number[], p: p5, t?: number) => {
                p.rotate(params[0]);
            }
        },
    ];

    const [String_, setString] = useState<Symbol[]>([]);

    const [iterations, setIterations] = useState<number>(-1);

    useEffect(() => {
        let string = axiom
        for (let i = 0; i < iterations; i++) {
            string = GPLS.applyProductions(string, productions);
        }
        setString(string);
        console.log(string);
    }, [axiom, productions, iterations])


    return (
        <div className={classes['container']}
            onClick={() => { }}//setIterations(iterations + 1)}
            onMouseLeave={() => setIterations(1)}>
            <Axiom_Maker axiom={axiom} setAxiom={setAxiom} />
            <Production_Maker productions={productions} setProductions={setProductions} />
            <L_Renderer string={String_} drawingRules={drawingRules} />
        </ div>
    )
}
