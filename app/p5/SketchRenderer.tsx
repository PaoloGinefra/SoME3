'use client'

import { useEffect, useRef, useState } from 'react'
import type p5 from 'p5'

import { SketchFunction } from './useSketch'

export interface SketchRendererProps {
  sketch: SketchFunction
  autoPauseOutsideViewport?: boolean
}

const SketchRenderer = ({
  sketch: sketchFunction,
  autoPauseOutsideViewport: autoPause = true,
}: SketchRendererProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const sketch = useRef<p5 | null>(null)
  const [intersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting)
    })

    observer.observe(ref.current!)

    return () => observer.disconnect()
  }, [])

  const handleAutoPause = () => {
    if (!sketch.current) return
    if (!autoPause) return

    if (intersecting) {
      sketch.current.loop()
    } else {
      sketch.current.noLoop()
    }
  }
  useEffect(() => handleAutoPause(), [intersecting])

  useEffect(() => {
    import('p5').then((p5Module) => {
      const { default: p5 } = p5Module
      const newSketch = new p5(sketchFunction, ref.current!)
      sketch.current = newSketch

      handleAutoPause()
    })

    return () => {
      // non sia mai che il componente viene smontato prima che lo sketch sia inizializzato
      if (sketch.current) {
        sketch.current.remove()
      }
    }
  }, [sketchFunction])

  return <div ref={ref}></div>
}

export default SketchRenderer
