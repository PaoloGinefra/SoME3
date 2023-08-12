'use client'

import { useEffect, useRef, useState } from 'react'
import p5, { Renderer } from 'p5'

import useStatefulSketch from '../p5/useStatefulSketch'
import SketchRenderer from '../p5/SketchRenderer'

import Grid from '../utils/Grid'
import { DrawingRule, Symbol } from '../GPLS/GPLS_interfaces'
import GPLS from '../GPLS/GPLS'

// basically the same drawing rules as Kock Flake
const drawingRules: DrawingRule[] = [
  {
    targetChars: 'F',
    drawing: (params, p, t = 1) => {
      const [len] = params
      p.stroke('#0070A9')
      p.strokeWeight(1)
      p.line(0, 0, len * t, 0)
      p.translate(len * t, 0)
    },
  },
  {
    targetChars: '+',
    drawing: (params, p, t: number = 1) => {
      const [angle] = params
      p.rotate(angle * t)
    },
  },
  {
    targetChars: '-',
    drawing: (params, p, t: number = 1) => {
      const [angle] = params
      p.rotate(-angle * t)
    },
  },
]

const DRAW_SPEED = 0.1

export default function ExampleSketch() {
  const [inputState, setInputState] = useState<Record<string, number>>({
    F: 50,
    '+': 60, // angles here are in degrees, later are converted into radians
    '-': 60,
  })
  const getParam = (ruleChar: string) => inputState[ruleChar]
  const setParam = (ruleChar: string, value: number) =>
    setInputState({ ...inputState, [ruleChar]: value })

  const [inputString, setInputString] = useState(
    '+F--F++F--F++F--F++F--F++F--F++F--F++F--F++F'
  )

  const lookup: Record<string, number> = {
    ...inputState,
    '+': inputState['+'] * (Math.PI / 180), // degree => radians
    '-': inputState['-'] * (Math.PI / 180),
  }
  const string: Symbol[] = inputString
    .split('')
    .map((char) => ({ char, params: [lookup[char]] }))

  const t = useRef(0)

  const triggerRedraw = () => {
    t.current = 0
  }

  useEffect(() => {
    triggerRedraw()
  }, [inputString])

  const sketch = useStatefulSketch({ string }, (state, p) => {
    const w = 700
    const h = 550

    let canvas: Renderer

    const grid = new Grid(w, h, 10, 0.1, 0.2, p)
    let startingPoint: p5.Vector = p.createVector(w / 2, h / 2)
    let offset = p.createVector(0, 0)

    let touchPoint = p.createVector(0, 0)
    let isHolding = false

    p.preload = function () {
      grid.preload()
    }

    p.setup = function () {
      canvas = p.createCanvas(w, h)
      grid.setup()

      canvas.mousePressed(() => {
        touchPoint = p.createVector(p.mouseX, p.mouseY)
        isHolding = true
      })

      canvas.mouseReleased(() => {
        isHolding = false
      })

      canvas.mouseOut(() => {
        isHolding = false
      })

      canvas.doubleClicked(() => {
        offset = p.createVector(0, 0)
      })
    }

    p.draw = function () {
      p.background(251, 234, 205)

      // grid
      if (isHolding) {
        offset.add(
          p.createVector(p.mouseX - touchPoint.x, p.mouseY - touchPoint.y)
        )
        touchPoint = p.createVector(p.mouseX, p.mouseY)
      }
      grid.draw(offset, 1)
      p.translate(startingPoint.x + offset.x, startingPoint.y + offset.y)

      // turtle
      p.push()

      GPLS.drawString(
        p,
        state.current.string,
        drawingRules,
        t.current * DRAW_SPEED,
        true,
        1,
        1
      )

      // draw turtle
      // NOTE: this works because the drawing instructions for the various parts translate the vanvas while drawing
      // TODO: consider adding turtle image
      p.push()
      p.ellipseMode(p.CENTER)
      p.fill('green')
      p.ellipse(0, 0, 25, 20)
      p.fill('white')
      p.ellipse(10, 5, 5, 5)
      p.ellipse(10, -5, 5, 5)
      p.pop()

      p.pop()

      t.current += 1
    }
  })

  return (
    <div>
      <fieldset>
        <label className="inline-block w-44" htmlFor="forwardSizeSlider">
          Forwards (F) amount
        </label>
        <input
          id="forwardSizeSlider"
          type="range"
          min={1}
          max={100}
          value={getParam('F')}
          onChange={(e) => setParam('F', parseInt(e.target.value))}
        />
        <p className="inline-block">{getParam('F')} px</p>
        <br />

        <label className="inline-block w-44" htmlFor="leftSizeSlider">
          Left (+) angle
        </label>
        <input
          id="leftSizeSlider"
          type="range"
          min={0}
          max={180}
          value={getParam('+')}
          onChange={(e) => setParam('+', parseInt(e.target.value))}
        />
        <p className="inline-block">{getParam('+')}°</p>
        <br />

        <label className="inline-block w-44" htmlFor="rightSizeSlider">
          Right (-) angle
        </label>
        <input
          id="rightSizeSlider"
          type="range"
          min={0}
          max={180}
          value={getParam('-')}
          onChange={(e) => setParam('-', parseInt(e.target.value))}
        />
        <p className="inline-block">{getParam('-')}°</p>
        <br />

        <label className="inline-block w-44" htmlFor="stringInput">
          Input string
        </label>
        <input
          id="stringInput"
          type="text"
          value={inputString}
          onChange={(e) => setInputString(e.target.value)}
        />
        <br />

        <button onClick={() => triggerRedraw()}>Redraw</button>
      </fieldset>

      <SketchRenderer sketch={sketch} />
    </div>
  )
}
