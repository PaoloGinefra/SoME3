'use client'

import { useState } from 'react'
import { TREES } from './trees'

export default function TreesBlurSketch() {
  const [slider, setSlider] = useState(0)

  return (
    <div className="my-8 mx-auto space-y-4 max-w-screen-lg">
      <fieldset>
        <div className="flex justify-center space-x-2">
          <span>Not blurred</span>
          <input
            id="opacitySlider"
            type="range"
            min={0}
            max={20}
            value={slider}
            onChange={(e) => setSlider(parseInt(e.target.value))}
          />
          <span>Blurred</span>
        </div>
      </fieldset>

      <div className="grid grid-rows-[1fr_auto] grid-flow-col auto-cols-fr gap-4">
        {TREES.map((tree) => (
          <>
            <img
              className="m-0 p-0 block w-auto h-full object-cover rounded-md"
              style={{ filter: `blur(${slider}px)` }}
              src={tree.img.full}
            />

            <p className="text-sm">
              Photo by{' '}
              <a className="underline" href={tree.attribution.author.link}>
                {tree.attribution.author.name}
              </a>{' '}
              on{' '}
              <a className="underline" href={tree.attribution.platform.link}>
                {tree.attribution.platform.name}
              </a>
            </p>
          </>
        ))}
      </div>
    </div>
  )
}
