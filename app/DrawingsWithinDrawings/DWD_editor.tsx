'use client'

import { useState } from 'react'
import { Image, Renderer } from 'p5'
import useStatefulSketch from '../p5/useStatefulSketch'
import SketchRenderer from '../p5/SketchRenderer'
import classes from '../Examples/example-sketch.module.css'
import type p5 from 'p5'

import Grid from '../utils/Grid'
import Shape, { Line } from './Classes/Shapes'
import { Square, Canvas, Shapes, ShapesNames } from './Classes/Shapes'

import ButtonCarousel from '../utils/ButtonCarousel'

export default function DWD_editor() {
    const [brushName, setBrushName] = useState('Square');
    const [brushSize, setBrushSize] = useState(50);
    const [brushRotation, setBrushRotation] = useState(0);

    const [showCanvasContour, setShowCanvasContour] = useState(false);

    const [undoCount, setUndoCount] = useState(0);

    const sketch = useStatefulSketch({ brushName, brushSize, brushRotation, showCanvasContour, undoCount, setUndoCount }, (state, p) => {
        const w = 600
        const h = 600

        let bgColor = p.color(251, 234, 205)
        let canvas: Renderer
        let Graphic: p5.Graphics
        let ghostGrpahic: p5.Graphics

        let gridSize = 10
        let grid = new Grid(w, h, gridSize, 0.2, 0.1, p);

        let shapes: Shape[] = []

        p.preload = function () {
            grid.preload()
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
            let undoCount = state.current.undoCount
            while (undoCount > 0) {
                shapes.pop()
                undoCount--;

                Graphic.clear(0, 0, 0, 0)
            }
            state.current.setUndoCount(0)


            //Draw the background
            p.background(bgColor)
            //p.background(0, 0, 0,)

            //grid.draw()

            //Graphic.background(0, 0, 0, 10)
            //Graphic.tint(0, 0, 0, 100)
            Graphic.background(0, 0, 0, 10)

            //Graphic.background(0, 0, 0, 10)
            shapes.forEach((s) => s.draw({ drawContour: state.current.showCanvasContour }))

            if (p.mouseX > 0 && p.mouseX < w && p.mouseY > 0 && p.mouseY < h) {
                let brush = Shapes.find((s) => s.name == state.current.brushName) ?? Shapes[0]
                let gost = new brush(p, Graphic, p.createVector(this.mouseX, this.mouseY), state.current.brushRotation, state.current.brushSize)
                gost.draw({ drawContour: state.current.showCanvasContour })
            }

            //Draw the graphic on screen
            p.image(Graphic, 0, 0)

        }

    })

    return (
        <div className={classes['container']}>
            <ButtonCarousel option={brushName} setOption={setBrushName} options={ShapesNames} optionsNames={ShapesNames}></ButtonCarousel>
            <input type="range" min="1" max={600} value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} />
            <p>Size: {brushSize}</p>

            <input type="range" min={-50} max={50} step={1} onChange={(e) => setBrushRotation(parseFloat(e.target.value) / 50 * 3.141)} />
            <p>Rotation: {Math.round(brushRotation * 180 / 3.141)} deg</p>

            <input type="checkbox" checked={showCanvasContour} onChange={(e) => setShowCanvasContour(e.target.checked)} />
            <p>Show canvas contour</p>

            <button onClick={() => setUndoCount(undoCount + 1)}>Undo</button>


            <SketchRenderer sketch={sketch} />
        </div>
    )
}
