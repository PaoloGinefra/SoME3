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
import AlphabetEditor from './AlphabetEditor'
import ModeButton from './Inreface/ModeButtons'
import CharPicker from './Inreface/CharPicker'
import Modes from './Inreface/Modes'
import { modesIcons } from './Inreface/Modes'


export default function L_Maker() {
    const [alphabet, setAlphabet] = useState<string>('F');
    const [axiom, setAxiom] = useState<Symbol[]>([]);
    const [productions, setProductions] = useState<Production[]>([]);
    const [drawingRules, setDrawingRules] = useState<DrawingRule[]>([
        {
            targetChars: alphabet,
            drawing: (params: number[], p: p5, t: number = 1) => {
                p.stroke(0, 0, 0, 255);
                p.strokeWeight(1);
                p.line(0, 0, params[0] * t, 0);
                p.translate(params[0] * t, 0);
            }
        },
        {
            targetChars: '+',
            drawing: (params: number[], p: p5, t: number = 1) => {
                p.rotate(params[0] * (1 - p.cos(t * p.PI)) / 2);
            }
        },
        {
            targetChars: '[',
            drawing: (params: number[], p: p5, t?: number) => {
                p.push();
            }
        },
        {
            targetChars: ']',
            drawing: (params: number[], p: p5, t?: number) => {
                p.pop();
            }
        }
    ]);

    const [String_, setString] = useState<Symbol[]>([]);

    const [iterations, setIterations] = useState<number>(5);

    const [startingAxiom, setStartingAxiom] = useState<Symbol[]>([]);

    const [mode, setMode] = useState<string>('Move');
    const [char, setChar] = useState<string>('F')

    useEffect(() => {
        let axiom = JSON.parse(localStorage.getItem('axiom') || '[]');
        //let productions = GPLS.DeserializeProductions(localStorage.getItem('productions') || '');
        let iterations = JSON.parse(localStorage.getItem('iterations') || '5');
        let alphabet = localStorage.getItem('alphabet') || 'F';


        setAxiom(axiom);
        //setProductions(productions);
        setIterations(iterations);
        setAlphabet(alphabet);

        drawingRules[0].targetChars = alphabet;
        setDrawingRules(drawingRules);

        setStartingAxiom(axiom)

        console.log('loaded', productions)
    }, [])

    useEffect(() => {
        let string = axiom
        for (let i = 0; i < iterations; i++) {
            string = GPLS.applyProductions(string, productions);
        }
        setString(string);

        localStorage.setItem('axiom', JSON.stringify(axiom));
        //localStorage.setItem('productions', GPLS.SerializeProductions(productions));
        localStorage.setItem('iterations', JSON.stringify(iterations));

    }, [axiom, productions, iterations])

    useEffect(() => {
        localStorage.setItem('alphabet', alphabet);
        drawingRules[0].targetChars = alphabet;
        setDrawingRules(drawingRules);
    }, [alphabet])


    return (
        <div
            onClick={() => { }}//setIterations(iterations + 1)}
            onMouseLeave={() => setIterations(iterations)}>
            <AlphabetEditor alphabet={alphabet} setAlphabet={setAlphabet} />
            <ModeButton Modes={Modes} mode={mode} setMode={setMode} modesIcons={[
                ...modesIcons,
                <div className='scale-[60%] w-8 flex justify-center'>
                    <CharPicker alphabet={alphabet} currentChar={char} setcurrentChar={setChar} />
                </div>
            ]} />
            <div className='flex gap-5 justify-center'>
                <Axiom_Maker char={char} setChar={setChar} mode={mode} setMode={setMode} axiom={axiom} setAxiom={setAxiom} alphabet={alphabet} startingAxiom={startingAxiom} />
                <Production_Maker char={char} setChar={setChar} mode={mode} setMode={setMode} productions={productions} setProductions={setProductions} alphabet={alphabet} />
            </div>
            <L_Renderer string={String_} drawingRules={drawingRules} iteration={iterations} setIteration={setIterations} />
        </ div >
    )
}
