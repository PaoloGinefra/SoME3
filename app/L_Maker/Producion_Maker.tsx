'use client'

import { useEffect, useState } from 'react'
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

import CharPicker from './Inreface/CharPicker'

interface Production_Maker_State {
    productions: Production[];
    setProductions: (p: Production[]) => void;
    alphabet: string;
    mode: string;
    setMode: (s: string) => void;
    char: string;
    setChar: (s: string) => void;
}

export default function Production_Maker({ productions, setProductions, alphabet, mode, setMode, char, setChar }: Production_Maker_State) {

    const [preChar, setPreChar] = useState<string>('F');
    const [points, setPoints] = useState<Point[]>([]);
    const [str, setStr] = useState<Symbol[]>([]);

    useEffect(() => {
        setStr(productions.find((p) => p.preChar == preChar)?.successor([1]) ?? [])
        console.log("oldStuff", productions.find((p) => p.preChar == preChar)?.successor([100]) ?? [])
    }, [preChar])

    useEffect(() => {
        handleSequence()
    }, [points])


    function handleSequence() {
        if (points.length < 2) return;

        console.log("pre Char in handle Sequence", preChar)
        const references = points.splice(0, 2)
        const s = GPLS.pointSequence2String(points)
        const len = points.length
        const dist = references[0].position.copy().sub(references[1].position).mag();
        const heading = references[1].position.copy().sub(references[0].position).heading();

        let newProduction = {
            preChar: preChar,
            condition: (params: number[]) => true,
            successor: (params: number[]) => {
                let newString: Symbol[] = []
                newString.push({
                    char: '+',
                    params: [-heading]
                })

                for (let i = 0; i < s.length; i++) {
                    if (alphabet.includes(s[i].char)) {
                        newString.push({
                            char: s[i].char,
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


        //Set the new production
        let i = productions.findIndex((p) => p.preChar == preChar)
        if (i != -1) {
            productions[i] = newProduction
            productions = [...productions]
        }
        else {
            productions = [...productions, newProduction]
        }
        setProductions(productions)
    }


    return (
        <div className='flex flex-col gap-2' >
            <div className='m-auto flex'>
                <h1 className='m-auto text-4xl'>Production: </h1>
                <CharPicker alphabet={alphabet} currentChar={preChar} setcurrentChar={setPreChar} />
                <h1 className='m-auto text-4xl'> ⮕ </h1>


            </div>
            <PointSequenceEditor char={char} setChar={setChar} mode={mode} setMode={setMode} string={str} preChar={preChar} handleSequence={(points_: Point[]) => {
                console.log("newStuff", points_)
                setPoints([...points_])
            }
            } alphabet={alphabet} referenceToggle={true} />

        </div >
    )
}