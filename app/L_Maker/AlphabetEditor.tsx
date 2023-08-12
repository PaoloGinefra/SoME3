'use client'

import { useState } from 'react'
import { Image, Renderer } from 'p5'

import useStatefulSketch from '../p5/useStatefulSketch'
import SketchRenderer from '../p5/SketchRenderer'

import classes from '../Examples/example-sketch.module.css'


interface AlphabetEditor_State {
    alphabet: string;
    setAlphabet: (s: string) => void;
}

export default function AlphabetEditor({ alphabet, setAlphabet }: AlphabetEditor_State) {
    function parseString(s: string): string {
        s += 'F'
        s = s.replace(/[ ||\n]/gi, '').toUpperCase();
        s = s.split("").sort().join("");

        let output = s[0];
        for (let i = 1; i < s.length; i++) {
            if (s[i] != s[i - 1]) {
                output += s[i];
            }
        }
        return output;
    }
    return (
        <div className='flex flex-col gap-4'>
            <h1 className='m-auto text-4xl'>Alphabet</h1>
            <input className='w-80  h-10 m-auto text-center rounded tracking-widest' type="text" value={alphabet} onChange={(e) => setAlphabet(parseString(e.target.value))} />
        </div>
    )
}