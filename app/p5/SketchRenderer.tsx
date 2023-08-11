'use client'

import { useEffect, useRef } from 'react'
import type p5 from 'p5'

import { SketchFunction } from './useSketch'

export interface SketchRendererProps {
  sketch: SketchFunction
}

const SketchRenderer = ({ sketch }: SketchRendererProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let p5sketch: p5 | null = null

    import('p5').then((p5Module) => {
      const { default: p5 } = p5Module

      p5sketch = new p5(sketch, ref.current!)
    })

    return () => {
      // non sia mai che il componente viene smontato prima che lo sketch sia inizializzato
      if (p5sketch) {
        p5sketch.remove()
      }
    }
  }, [sketch])

  return <div ref={ref}></div>
}

export default SketchRenderer
