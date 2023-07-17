'use client'

import { useState } from 'react'
import { Image, Renderer } from 'p5'

import useStatefulSketch from '../p5/useStatefulSketch'
import SketchRenderer from '../p5/SketchRenderer'

import classes from './example-sketch.module.css'

export default function ExampleSketch() {
  const [size, setSize] = useState(50)

  const sketch = useStatefulSketch({ size }, (state, p) => {
    const w = 200
    const h = 200
    const margin = 50

    const r = p.random(0, 255)
    const g = p.random(0, 255)
    const b = p.random(0, 255)

    const emoji = p.random(['🤓', '🤔', '🤡'])
    const url = `https://emojicdn.elk.sh/${emoji}?style=google`

    let canvas: Renderer
    let img: Image

    p.preload = function () {
      img = p.loadImage(url)
    }

    p.setup = function () {
      canvas = p.createCanvas(w, h)
      canvas.mouseClicked(function () {
        setSize(50)
      })
    }

    p.draw = function () {
      p.background(r, g, b)

      const s = (state.current.size / 100) * (w - margin)
      p.imageMode(p.CENTER)
      p.image(img, w / 2, h / 2, s, s)
    }

    // non va bene perchè il listener è su window e non sull'elemento dello sketch
    // p.mouseClicked = function () {
    //   setSize(50)
    // }
  })

  return (
    <div className={classes['container']}>
      <label htmlFor="sizeSlider">Dimensione</label>
      <input
        id="sizeSlider"
        type="range"
        min={1}
        max={100}
        value={size}
        onChange={(e) => setSize(parseInt(e.target.value))}
      />
      <SketchRenderer sketch={sketch} />
    </div>
  )
}
