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
  const [opacity, setOpacity] = useState(100)
  const [selection, setSelection] = useState(0)

  const tree = TREES[selection]

  return (
    <div className="my-8">
      <fieldset className="mb-4">
        <div>
          <label htmlFor="treeSelect">Tree</label>
          <select
            id="treeSelect"
            onChange={(e) => setSelection(parseInt(e.target.value))}
          >
            {TREES.map((item, i) => (
              <option key={i} value={i}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span>Branches</span>
          <input
            id="opacitySlider"
            type="range"
            min={0}
            max={100}
            value={opacity}
            onChange={(e) => setOpacity(parseInt(e.target.value))}
          />
          <span>Leaves</span>
        </div>
      </fieldset>

      <div className="relative bg-white">
        <img className="m-0 p-0" src={tree.img.branches} alt="" />
        <img
          className="m-0 p-0 absolute top-0 right-0"
          style={{ opacity: opacity / 100 }}
          src={tree.img.full}
          alt=""
        />
      </div>

      <p className="text-sm">
        Photo by{' '}
        <a href={tree.attribution.author.link}>
          {tree.attribution.author.name}
        </a>{' '}
        on{' '}
        <a href={tree.attribution.platform.link}>
          {tree.attribution.platform.name}
        </a>
      </p>
    </div>
  )
}
