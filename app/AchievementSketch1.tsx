'use client'

import { useState } from 'react'
import { Renderer } from 'p5'

import useStatefulSketch from './p5/useStatefulSketch'
import SketchRenderer from './p5/SketchRenderer'
import { useAchievement } from './achievements'

export default function AchievementSketch() {
  const [achieved, setAchieved] = useAchievement('achievement1')

  const sketch = useStatefulSketch({ achieved }, (state, p) => {
    const w = 200
    const h = 200
    const margin = 50

    let r = p.random(0, 255)
    let g = p.random(0, 255)
    let b = p.random(0, 255)

    let canvas: Renderer

    p.setup = function () {
      canvas = p.createCanvas(w, h)
      canvas.mouseClicked(function () {
        setAchieved(!state.current.achieved)
      })
    }

    p.draw = function () {
      p.background(r, g, b)

      p.textAlign(p.CENTER, p.CENTER)
      p.textSize(100)
      if (state.current.achieved) {
        p.text('🏆', w / 2, h / 2)
      } else {
        p.text('❌', w / 2, h / 2)
      }
    }
  })

  return <SketchRenderer sketch={sketch} />
}
