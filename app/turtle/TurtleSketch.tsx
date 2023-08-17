'use client'

import { useEffect, useRef, useState } from 'react'
import p5, { Renderer } from 'p5'

import useStatefulSketch from '../p5/useStatefulSketch'
import SketchRenderer from '../p5/SketchRenderer'

import Grid from '../utils/Grid'

interface TurtleState {
  pos: { x: number; y: number }
  rot: number
}

type TurtleCmdDrawFunction = (
  p: p5,
  stack: TurtleState[],
  params: number[],
  t: number
) => void

const turtleDrawFunctions: Record<string, TurtleCmdDrawFunction> = {
  F: (p, stack, params, t) => {
    const state = stack[stack.length - 1]
    const [len] = params

    p.push()
    p.translate(state.pos.x, state.pos.y)
    p.rotate(state.rot)

    p.stroke('#0070A9')
    p.strokeWeight(1)
    p.line(0, 0, len * t, 0)

    p.pop()

    state.pos.x += len * t * Math.cos(state.rot)
    state.pos.y += len * t * Math.sin(state.rot)
  },

  '+': (p, stack, params, t) => {
    const state = stack[stack.length - 1]
    const [angle] = params
    state.rot += angle * t
  },

  '-': (p, stack, params, t) => {
    const state = stack[stack.length - 1]
    const [angle] = params
    state.rot -= angle * t
  },

  '[': (p, stack, params, t) => {
    const state = stack[stack.length - 1]
    const copiedState = {
      pos: { x: state.pos.x, y: state.pos.y },
      rot: state.rot,
    }
    stack.push(copiedState)
  },

  ']': (p, stack, params, t) => {
    stack.pop()
  },
}

function drawTurtle(p: p5, state: TurtleState) {
  p.push()
  p.translate(state.pos.x, state.pos.y)
  p.rotate(state.rot)

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

  const stack: TurtleState[] = [
    {
      pos: { x: 0, y: 0 },
      rot: 0,
    },
  ]
  let i = 0

  while (i < t && i < cmdString.length) {
    const cmd = cmdString[i]

    const cmdDrawFunct = turtleDrawFunctions[cmd]
    const cmdParams = paramsLookup[cmd]
    const cmdT = p.constrain(t - i, 0, 1)
    cmdDrawFunct(p, stack, cmdParams, cmdT)

    i += 1
  }

  drawTurtle(p, stack[stack.length - 1])

  return [i - 1, stack] as const
}

function calculateDimensions(p: p5) {
  const w = p.constrain(p.windowWidth * (8 / 12), 300, 1200)
  const h = p.constrain(p.windowHeight * (6 / 12), 300, 1200)

  return [w, h] as const
}

export interface ExampleSketchProps {
  withStack: boolean
  defaultString: string
}

export default function ExampleSketch({
  withStack,
  defaultString,
}: ExampleSketchProps) {
  const [drawingSpeed, setDrawingSpeed] = useState(0.03)
  const [pause, setPause] = useState(true)

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
  const [reactStack, setReactStack] = useState<TurtleState[]>([])
  const t = useRef(0)

  const triggerRedraw = () => {
    t.current = 0
  }

  useEffect(() => {
    triggerRedraw()
  }, [string])

  const sketch = useStatefulSketch(
    { pause, drawingSpeed, string, paramsLookup },
    (state, p) => {
      let [w, h] = calculateDimensions(p)

      let canvas: Renderer

      const grid = new Grid(w, h, 10, 0.1, 0.2, p)
      let startingPoint: p5.Vector = p.createVector(w / 2, h / 2)
      let offset = p.createVector(0, 0)

      let touchPoint = p.createVector(0, 0)
      let isHolding = false

      let prevStep = -1

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

        const [currentStep, stack] = draw(
          p,
          state.current.string,
          state.current.paramsLookup,
          t.current
        )
        const turtleState = stack[stack.length - 1]
        const turtleStack = stack.slice(0, -1)

        // begin: top text
        const { string } = state.current
        p.textFont('monospace', 24)
        for (let i = currentStep; i < string.length; i++) {
          p.push() // begin: letter
          if (currentStep == i) {
            p.textStyle(p.BOLD)
          }

          const letterHeight = 24 * (6 / 5)
          p.text(
            string[i],
            turtleState.pos.x,
            turtleState.pos.y + (currentStep - i) * letterHeight - 24
          )

          p.pop() // end: letter
        }
        // end: top text

        p.pop() // end: grid

        if (currentStep != prevStep) {
          prevStep = currentStep
          setReactStack(turtleStack)
        }

        if (!state.current.pause) {
          t.current += state.current.drawingSpeed
        }
      }

      p.windowResized = function () {
        ;[w, h] = calculateDimensions(p)
        p.resizeCanvas(w, h)
        grid.resize(w, h)
      }
    }
  )

  return (
    <div className="my-8 flex flex-col items-center">
      <fieldset className="mb-8 grid grid-cols-3 gap-4">
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

        <label className="inline-block w-44" htmlFor="rightSizeSlider">
          Drawing speed
        </label>
        <input
          id="rightSizeSlider"
          type="range"
          min={0.001}
          max={0.2}
          step={0.001}
          value={drawingSpeed}
          onChange={(e) => setDrawingSpeed(parseFloat(e.target.value))}
        />
        <p className="inline-block">{drawingSpeed}</p>

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

        <div></div>

        <button onClick={() => triggerRedraw()}>Reset</button>
        <button onClick={() => setPause(!pause)}>
          {pause ? 'Draw' : 'Pause'}
        </button>
        <button
          onClick={() => {
            t.current = string.length
          }}
        >
          Skip
        </button>
      </fieldset>

      <div className="flex justify-center flex-col items-start sm:flex-row sm:items-end">
        <SketchRenderer sketch={sketch} />

        {withStack && (
          <div className="my-6 sm:my-0 sm:mx-6 w-full sm:w-32">
            <div className="w-full max-h-60 sm:max-h-full sm:h-[48vh] overflow-y-scroll flex flex-col-reverse">
              {reactStack.map((s, i) => (
                <div key={i} className="p-2 border-2 border-gray-200">
                  <p>x: {Math.round(s.pos.x)}px</p>
                  <p>y: {Math.round(s.pos.y)}px</p>
                  <p>rot: {Math.round(s.rot * (180 / Math.PI))}°</p>
                </div>
              ))}
            </div>
            <p className="bg-gray-200 text-gray-900 text-center font-bold">
              Stack
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
