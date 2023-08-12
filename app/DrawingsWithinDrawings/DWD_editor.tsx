'use client'

import { useState } from 'react'
import { Image, Renderer } from 'p5'
import useStatefulSketch from '../p5/useStatefulSketch'
import SketchRenderer from '../p5/SketchRenderer'
import classes from '../Examples/example-sketch.module.css'
import type p5 from 'p5'

import Grid from '../utils/Grid'
import Shape, { Line } from './Classes/Shapes'
import { Square, Canvas, Shapes, ShapesNames, ShapesEmojis } from './Classes/Shapes'

import ButtonCarousel from '../utils/ButtonCarousel'

export default function DWD_editor() {
    const [brushName, setBrushName] = useState('Square');
    const [brushSize, setBrushSize] = useState(50);
    const [brushRotation, setBrushRotation] = useState(0);

    const [showCanvasContour, setShowCanvasContour] = useState(false);

    const [undoCount, setUndoCount] = useState(0);

    const sketch = useStatefulSketch({ brushName, brushSize, brushRotation, showCanvasContour, undoCount, setUndoCount }, (state, p) => {
        let w = p.windowWidth * 0.8
        let h = 700

        let bgColor = p.color(251, 234, 205)
        let canvas: Renderer
        let Graphic: p5.Graphics
        let ghostGrpahic: p5.Graphics

        let gridSize = 10
        let grid = new Grid(w, h, gridSize, 0.2, 0.1, p);

        let shapes: Shape[] = []

        let leafImage: p5.Image

        p.windowResized = function () {
            p.resizeCanvas(p.windowWidth * 0.8, h)
            Graphic = p.createGraphics(p.windowWidth * 0.9, h)
        }

        p.preload = function () {
            grid.preload()
            leafImage = p.loadImage('assets/DWD/leaf.svg')
        }

        p.setup = function () {
            canvas = p.createCanvas(w, h)
            Graphic = p.createGraphics(w, h)
            ghostGrpahic = p.createGraphics(w, h)

            grid.setup()

            // shapes.push(
            //     new Canvas(p, Graphic, p.createVector(w / 2, h / 2), 0, w * 0.9),
            //     new Square(p, Graphic, p.createVector(200, 100), 0, 50),
            // )

            canvas.mousePressed(() => {
                let brush = Shapes.find((s) => s.name == state.current.brushName) ?? Shapes[0]
                shapes.push(
                    new brush(p, Graphic, p.createVector(this.mouseX, this.mouseY), state.current.brushRotation, state.current.brushSize)
                )
            })
        }

        p.draw = function () {
            w = p.windowWidth
            h = p.windowHeight;
            let undoCount = state.current.undoCount
            while (undoCount > 0) {
                shapes.pop()
                undoCount--;
            }
            state.current.setUndoCount(0)


            //Draw the background
            p.background(0, 0, 0)
            //p.background(0, 0, 0,)

            //grid.draw()

            //Graphic.background(0, 0, 0, 10)
            //Graphic.tint(0, 0, 0, 100)
            Graphic.background(0, 0, 0, 10)

            //Graphic.background(0, 0, 0, 10)
            shapes.forEach((s) => {
                if (s instanceof Canvas)
                    s.draw({ drawContour: state.current.showCanvasContour, leaf: leafImage })
            })

            shapes.forEach((s) => {
                if (!(s instanceof Canvas))
                    s.draw({ drawContour: state.current.showCanvasContour, leaf: leafImage })
            })

            if (p.mouseX > 0 && p.mouseX < w && p.mouseY > 0 && p.mouseY < h) {
                let brush = Shapes.find((s) => s.name == state.current.brushName) ?? Shapes[0]
                let gost = new brush(p, Graphic, p.createVector(this.mouseX, this.mouseY), state.current.brushRotation, state.current.brushSize)
                gost.draw({ drawContour: state.current.showCanvasContour, leaf: leafImage })
            }

            //Draw the graphic on screen
            p.image(Graphic, 0, 0)

        }

    })

    return (
        <div className='flex flex-col align-middle justify-center'>
            <ButtonCarousel option={brushName} setOption={setBrushName} options={ShapesNames} optionsNames={ShapesEmojis}></ButtonCarousel>

            <div className='m-auto'>
                <SketchRenderer sketch={sketch} />
            </div>

            <div className='flex m-auto gap-3 flex-auto my-3'>
                <div className='flex flex-col flex-auto'>
                    <input className='w-40 h-6 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
                        type="range" min="1" max={600} value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} />
                    <p className='relative bold text-center m-auto'>Size: {brushSize}</p>
                </div>

                <div className='flex flex-col flex-auto'>
                    <input className='w-40 h-6 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
                        type="range" min={-36} max={36} step={1} onChange={(e) => setBrushRotation(parseFloat(e.target.value) / 36 * 3.141)} />
                    <p className='relative bold text-center m-auto'>Rotation: {Math.round(brushRotation * 180 / 3.141)} deg</p>
                </div>

                <div className='flex flex-col flex-auto'>
                    <input className='w-5 h-6 m-auto bg-gray-700' type="checkbox" checked={showCanvasContour} onChange={(e) => setShowCanvasContour(e.target.checked)} />
                    <p>Canvas contours</p>
                </div>

                <div className='flex flex-col flex-auto '>
                    <button className="m-auto font-bold h-6 w-10 border-0 text-gray-500 hover:text-white" onClick={() => setUndoCount(undoCount + 1)}>↩</button>
                    <p>Undo</p>
                </div>

            </div>

        </div >
    )
}
