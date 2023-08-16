'use client'

import { useState } from 'react'

const TREES = [
  {
    label: 'Tree',
    img: {
      full: '/assets/trees/tree-full-1.jpg',
      branches: 'assets/trees/tree-branches-1.png',
    },
    attribution: {
      author: {
        name: 'Laura Ockel',
        link: 'https://unsplash.com/@viazavier?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
      },
      platform: {
        name: 'Unspash',
        link: 'https://unsplash.com/photos/lya-C_2uQD4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
      },
    },
  },
  {
    label: 'Plant',
    img: {
      full: '/assets/trees/tree-full-2.jpg',
      branches: 'assets/trees/tree-branches-2.png',
    },
    attribution: {
      author: {
        name: 'Annie Spratt',
        link: 'https://unsplash.com/@anniespratt?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
      },
      platform: {
        name: 'Unspash',
        link: 'https://unsplash.com/photos/hX_hf2lPpUU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
      },
    },
  },
]

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
        {TREES.map((tree) => (
          <>
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
          </>
        ))}
      </div>
    </div>
  )
}
