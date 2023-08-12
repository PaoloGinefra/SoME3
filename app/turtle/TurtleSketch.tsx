'use client'

import { useEffect, useRef, useState } from 'react'
import p5, { Renderer } from 'p5'

import useStatefulSketch from '../p5/useStatefulSketch'
import SketchRenderer from '../p5/SketchRenderer'

import Grid from '../utils/Grid'

type TurtleCmdDrawFunction = (p: p5, params: number[], t: number) => void

const turtleDrawFunctions: Record<string, TurtleCmdDrawFunction> = {
  F: (p, params, t) => {
    const [len] = params
    p.stroke('#0070A9')
    p.strokeWeight(1)
    p.line(0, 0, len * t, 0)
    p.translate(len * t, 0)
  },

  '+': (p, params, t) => {
    const [angle] = params
    p.rotate(angle * t)
  },

  '-': (p, params, t) => {
    const [angle] = params
    p.rotate(-angle * t)
  },

  '[': (p, params, t) => {
    p.push()
  },

  ']': (p, params, t) => {
    p.pop()
  },
}

function drawTurtle(p: p5) {
  p.push()
  p.ellipseMode(p.CENTER)
  p.fill('green')
  p.ellipse(0, 0, 25, 20)
  p.fill('white')
  p.ellipse(10, 5, 5, 5)
  p.ellipse(10, -5, 5, 5)
  p.pop()
}

function draw(
  p: p5,
  str: string,
  paramsLookup: Record<string, number[]>,
  t: number
) {
  const cmdString = str.split('')

  let turtleStep = 0

  for (let i = 0; i < cmdString.length; i++) {
    const cmd = cmdString[i]

    const cmdDrawFunct = turtleDrawFunctions[cmd]
    const cmdParams = paramsLookup[cmd]
    const cmdT = p.constrain(t - i, 0, 1)
    cmdDrawFunct(p, cmdParams, cmdT)

    if (t - i >= 1) {
      turtleStep++
    }

    if (t - i >= 0 && t - i < 1) {
      drawTurtle(p)
    }
  }

  // enought time has passed to draw the entire path
  // so draw the turtle at the end
  if (turtleStep == cmdString.length) {
    drawTurtle(p)
  }

  return turtleStep
}

const DRAW_SPEED = 0.02

export interface ExampleSketchProps {
  withStack: boolean
  defaultString: string
}

export default function ExampleSketch({
  withStack,
  defaultString,
}: ExampleSketchProps) {
  const [inputState, setInputState] = useState<Record<string, number>>({
    F: 50,
    '+': 60, // angles here are in degrees, later are converted into radians
    '-': 60,
  })

  const paramsLookup: Record<string, number[]> = {
    F: [inputState['F']],
    '+': [inputState['+'] * (Math.PI / 180)], // degree => radians
    '-': [inputState['-'] * (Math.PI / 180)],
    '[': [],
    ']': [],
  }

  const getParam = (ruleChar: string) => inputState[ruleChar]
  const setParam = (ruleChar: string, value: number) =>
    setInputState({ ...inputState, [ruleChar]: value })

  const [string, setInputString] = useState(defaultString)

  const t = useRef(0)

  const triggerRedraw = () => {
    t.current = 0
  }

  useEffect(() => {
    triggerRedraw()
  }, [string])

  const sketch = useStatefulSketch({ string, paramsLookup }, (state, p) => {
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

      p.push() // begin: grid

      if (isHolding) {
        offset.add(
          p.createVector(p.mouseX - touchPoint.x, p.mouseY - touchPoint.y)
        )
        touchPoint = p.createVector(p.mouseX, p.mouseY)
      }
      grid.draw(offset, 1)
      p.translate(startingPoint.x + offset.x, startingPoint.y + offset.y)

      // turtle
      p.push() // begin: path
      const currentStep = draw(
        p,
        state.current.string,
        state.current.paramsLookup,
        t.current * DRAW_SPEED
      )
      p.pop() // end: path

      p.pop() // end: grid

      const { string } = state.current
      p.textFont('monospace', 24)
      for (let i = 0; i < string.length; i++) {
        p.push() // begin: letter
        if (currentStep == i) {
          p.textStyle(p.BOLD)
        }

        const letterWidth = 24 * (3 / 4)
        const offs = letterWidth * (i - string.length / 2)
        p.text(string[i], w / 2 + offs, 50)
        p.pop() // end: letter
      }

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
          value={string}
          onChange={(e) => {
            const regex = withStack
              ? /[^F\+\-\[\]]/ // matches everything except for the characters F+-[]
              : /[^F\+\-]/ // matches everything except for the characters F+-
            const sanitizedInput = e.target.value.replace(regex, '')
            setInputString(sanitizedInput)
          }}
        />
        <br />

        <button onClick={() => triggerRedraw()}>Redraw</button>
      </fieldset>

      <SketchRenderer sketch={sketch} />
    </div>
  )
}
