'use client'

import { useState } from 'react'
import { Image, Renderer } from 'p5'

import useStatefulSketch from '../p5/useStatefulSketch'
import SketchRenderer from '../p5/SketchRenderer'

interface StringRendererProps {
    String: string,
}

export default function StringRenderer({ String }: StringRendererProps) {
    const [length, setLenght] = useState(20);
    const [rotation, setRotation] = useState(20);


    const sketch = useStatefulSketch({ length, rotation, String }, (state, p) => {
        let w = p.windowWidth * 0.8
        const h = 700

        let canvas: Renderer

        function drawLine(length: number, t: number) {
            p.stroke(255)
            p.line(0, 0, length * t, 0)
            p.translate(length * t, 0)
        }

        function rotate(rot: number) {
            p.rotate(rot);
        }

        function push() {
            p.push()
        }

        function pop() {
            p.pop()
        }

        let drawingRules: { [key: string]: (t: number) => void } = {
            'F': (t: number) => {
                drawLine(state.current.length, t)
            },
            '+': (t: number) => {
                rotate(p.radians(state.current.rotation))
            },
            '-': (t: number) => {
                rotate(p.radians(-state.current.rotation))
            },
            '[': (t: number) => {
                push()
            },
            ']': (t: number) => {
                pop()
            },
        }


        p.setup = function () {
            canvas = p.createCanvas(w, h)

        }

        p.draw = function () {
            this.background(0, 0, 0)
            p.translate(w / 2, h / 2)
            state.current.String.split('').forEach(c => {
                if (drawingRules[c])
                    drawingRules[c](1)
            }
            )
        }

        p.windowResized = function () {
            w = p.windowWidth * 0.8;
            p.resizeCanvas(w, h)
        }


    })

    return (
        <div className=''>
            <SketchRenderer sketch={sketch} />
        </div>
    )
}
