'use client'

import { Fragment, useState } from 'react'
import { TREES } from './trees'

export default function TreesSketch() {
  const [slider, setSlider] = useState(0)

  return (
    <div className="my-8 mx-auto space-y-4 max-w-screen-lg">
      <fieldset>
        <div className="flex justify-center space-x-2">
          <span>With leaves</span>
          <input
            id="opacitySlider"
            type="range"
            min={0}
            max={100}
            value={slider}
            onChange={(e) => setSlider(parseInt(e.target.value))}
          />
          <span>Only branches</span>
        </div>
      </fieldset>

      <div className="grid grid-rows-[1fr_auto] grid-flow-col auto-cols-fr gap-4">
        {TREES.map((tree, i) => (
          <Fragment key={i}>
            <div className="relative block w-auto h-full rounded-md bg-neutral-700">
              <img
                className="m-0 p-0 block w-auto h-full object-cover rounded-md"
                src={tree.img.branches}
              />
              <img
                className="m-0 p-0 block w-auto h-full object-cover rounded-md absolute top-0"
                style={{ opacity: (100 - slider) / 100 }}
                src={tree.img.full}
              />
            </div>

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
          </Fragment>
        ))}
      </div>
    </div>
  )
}
