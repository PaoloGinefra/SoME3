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
        <div className={classes['container']}>
            <h1>Alphabet Editor</h1>
            <input type="text" value={alphabet} onChange={(e) => setAlphabet(parseString(e.target.value))} />
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginTop: '20px' }}>
                {
                    alphabet.split('').map((char, i) => {
                        return (
                            <div key={i} style={{ border: '3px solid white', borderRadius: '5px', padding: '10px' }}>
                                <p>{char}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}