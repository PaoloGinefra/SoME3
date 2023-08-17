'use client'

import { useState } from 'react'
import { Image, Renderer } from 'p5'

import useStatefulSketch from '../p5/useStatefulSketch'
import SketchRenderer from '../p5/SketchRenderer'

import { ChromePicker } from 'react-color'

interface StringRendererProps {
    String: string,
}

export default function StringRenderer({ String }: StringRendererProps) {
    const [length, setLenght] = useState(20);
    const [rotation, setRotation] = useState(20);
    const [lineWidth, setLineWidth] = useState(1);
    const [leafSize, setLeafSize] = useState(20);

    const [frwStr, setFrwStr] = useState('Ff');
    const [penDownStr, setPenDownStr] = useState('F');
    const [posRotStr, setPosRotStr] = useState('+');
    const [negRotStr, setNegRotStr] = useState('-');
    const [pushStr, setPushStr] = useState('[');
    const [popStr, setPopStr] = useState(']');
    const [leafStr, setLeafStr] = useState('L');

    const [bgColor, setBgColor] = useState({ rgb: { r: 0, g: 0, b: 0, a: 1 }, hex: '#FFFFFFFF' });
    const [lineColor, setlineColor] = useState({ rgb: { r: 255, g: 255, b: 255, a: 1 }, hex: '#FFFFFFFF' });

    const [animate, setAnimate] = useState(false);

    let DrawingStrings = [
        { name: 'Forward', string: frwStr, setString: setFrwStr },
        { name: 'Pen Down', string: penDownStr, setString: setPenDownStr },
        { name: 'Positive Rotation', string: posRotStr, setString: setPosRotStr },
        { name: 'Negative Rotation', string: negRotStr, setString: setNegRotStr },
        { name: 'Push', string: pushStr, setString: setPushStr },
        { name: 'Pop', string: popStr, setString: setPopStr },
        { name: 'Leaf', string: leafStr, setString: setLeafStr },
    ]


    const sketch = useStatefulSketch({ length, rotation, String, bgColor, frwStr, penDownStr, posRotStr, negRotStr, pushStr, popStr, lineColor, lineWidth, leafStr, leafSize, animate, setAnimate }, (state, p) => {
        let w = p.windowWidth * 0.8
        const h = 700

        let canvas: Renderer
        let leafSprite: Image

        let t = 0;

        let pos_offset = p.createVector(0, 0)
        let isDown = false;
        let touchPoint = p.createVector(0, 0)

        function penDown() {
            p.strokeWeight(state.current.lineWidth)
            p.strokeCap(p.ROUND)
            p.stroke(state.current.lineColor.rgb.r, state.current.lineColor.rgb.g, state.current.lineColor.rgb.b, state.current.lineColor.rgb.a * 255)
        }

        function penUp() {
            p.stroke(0)
        }

        function drawLine(length: number, t: number) {
            p.line(0, 0, length * t, 0)
            p.translate(length * t, 0)
        }

        function rotate(rot: number, t: number) {
            p.rotate(p.radians(rot * t));
        }

        function push() {
            p.push()
        }

        function pop() {
            p.pop()
        }

        function leaf(t: number) {
            p.imageMode(p.CENTER)
            p.push()
            p.translate(state.current.leafSize / 2 * t, 0)
            p.rotate(p.PI / 2 * 0.8)
            p.image(leafSprite, 0, 0, state.current.leafSize * t + 0.00001, state.current.leafSize * t + 0.00001)
            p.pop()

        }

        p.mousePressed = function () {
            touchPoint = p.createVector(p.mouseX, p.mouseY)
            isDown = true
        }

        p.mouseReleased = function () {
            isDown = false
        }

        p.preload = function () {
            leafSprite = p.loadImage('/assets/DWD/leaf.svg')
        }

        p.setup = function () {
            canvas = p.createCanvas(w, h)

        }

        p.draw = function () {
            if (state.current.animate) {
                t = 0;
                setAnimate(false)
            }

            if (isDown) {
                pos_offset.add(p.createVector(p.mouseX - touchPoint.x, p.mouseY - touchPoint.y))
                touchPoint = p.createVector(p.mouseX, p.mouseY)
            }

            this.background(state.current.bgColor.rgb.r, state.current.bgColor.rgb.g, state.current.bgColor.rgb.b, state.current.bgColor.rgb.a * 255)
            p.translate(w / 2, h / 2);
            p.translate(pos_offset.x, pos_offset.y)

            let offset = 0;
            state.current.String.split('').forEach(c => {
                let myTime = p.constrain(t - offset, 0, 1)
                if (state.current.penDownStr.includes(c))
                    penDown()
                else
                    penUp()
                if (state.current.frwStr.includes(c))
                    drawLine(state.current.length, myTime)
                if (state.current.posRotStr.includes(c))
                    rotate(state.current.rotation, myTime)
                if (state.current.negRotStr.includes(c))
                    rotate(-state.current.rotation, myTime)
                if (state.current.pushStr.includes(c)) {
                    push()
                    offset += 0.01 * p.log(state.current.String.length)
                }
                if (state.current.popStr.includes(c)) {
                    pop()
                    offset -= 0.01 * p.log(state.current.String.length)
                }
                if (state.current.leafStr.includes(c))
                    leaf(myTime)
                offset += 5 / state.current.String.length
            }
            )

            t += p.deltaTime / 1000
        }

        p.windowResized = function () {
            w = p.windowWidth * 0.8;
            p.resizeCanvas(w, h)
        }


    })

    return (
        <div className=''>

            <SketchRenderer sketch={sketch} />
            <div className='flex m-auto justify-center gap-5 mt-6'>
                <div className='flex flex-col'>
                    <input
                        className='h-6'
                        type="range"
                        min={0}
                        max={180}
                        step={0.01}
                        value={length}
                        onChange={(e) => setLenght(parseFloat(e.target.value))}
                    />
                    <label className="inline-block w-44 m-auto text-center">
                        Forward length: <br />
                        {length}
                    </label>
                </div>

                <div className='flex flex-col'>
                    <input
                        className='h-6'
                        type="range"
                        min={0}
                        max={180}
                        value={rotation}
                        onChange={(e) => setRotation(parseFloat(e.target.value))}
                    />
                    <label className="inline-block w-44 m-auto text-center">
                        Rotation step: <br />
                        {rotation}
                    </label>
                </div>

                <div className='flex flex-col'>
                    <input
                        className='h-6'
                        type="range"
                        min={0}
                        max={10}
                        step={0.01}
                        value={lineWidth}
                        onChange={(e) => setLineWidth(parseFloat(e.target.value))}
                    />
                    <label className="inline-block w-44 m-auto text-center">
                        Line width: <br />
                        {lineWidth}
                    </label>
                </div>

                <div className='flex flex-col'>
                    <input
                        className='h-6'
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={leafSize}
                        onChange={(e) => setLeafSize(parseFloat(e.target.value))}
                    />
                    <label className="inline-block w-44 m-auto text-center">
                        Leaf size: <br />
                        {leafSize}
                    </label>
                </div>

                <button className='m-auto mt-6 px-2' onClick={() => setAnimate(true)}>Animate</button>

            </div>

            <div className='flex felx-row justify-center gap-4'>
                <div className='flex flex-col gap-2'>
                    <label className='m-auto mt-6' htmlFor="sizeSlider">Background Color</label>
                    <ChromePicker
                        color={bgColor.rgb}
                        onChange={(color: any, event: any) => setBgColor({ ...color })}
                    />
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='m-auto mt-6' htmlFor="sizeSlider">Line Color</label>
                    <ChromePicker
                        color={lineColor.rgb}
                        onChange={(color: any, event: any) => setlineColor(color)}
                    />
                </div>
            </div>

            <h1 className='text-4xl m-auto mt-6 text-center'>Drawing Rules</h1>
            <div className='grid grid-flow-row grid-cols-3 justify-center m-auto mt-6 gap-4'>
                {DrawingStrings.map((str, i) => (
                    <div className='flex flex-col gap-2 justify-center text-center'>
                        <label className='' htmlFor="sizeSlider">{str.name}</label>
                        <input
                            className='p-2 rounded-md text-center'
                            type="text"
                            value={str.string}
                            onChange={(e) => {
                                let s = e.target.value
                                s = s.replace(/[ ||\n]/gi, '')
                                s = s.split('').sort().join('')
                                let alphabetOutput = s[0]
                                for (let i = 1; i < s.length; i++) {
                                    if (s[i] != s[i - 1]) {
                                        alphabetOutput += s[i]
                                    }
                                }
                                str.setString(alphabetOutput)

                            }

                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
