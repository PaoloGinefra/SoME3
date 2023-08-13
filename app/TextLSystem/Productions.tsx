import React from 'react'
import Production from './Interface/Production'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

interface ProductionState {
  productions: Production[]
  setProductions: (p: Production[]) => void
  alphabet: string
  active: boolean
}

export default function Productions({
  productions,
  setProductions,
  alphabet,
  active,
}: ProductionState) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <h1 className="m-auto text-4xl">Productions</h1>
      <ul className="flex flex-col gap-4">
        {!alphabet ? (
          <li className="m-auto tracking-widest font-mono">
            … →{' '}
            <input
              type="text"
              disabled
              className="w-80 h-10 px-2 text-left rounded"
            />
          </li>
        ) : (
          alphabet.split('').map((letter) => (
            <li className="m-auto tracking-widest font-mono">
              {letter} →{' '}
              <input
                className={
                  'w-80 h-10 px-2 text-left rounded ' + inter.className
                }
                disabled={active}
                type="text"
                value={
                  productions.find((prod) => prod.preChar == letter)?.successor
                }
                onChange={(e) => {
                  console.log(productions)

                  let output = e.target.value
                  output = output
                    .split('')
                    .filter((c) => alphabet.includes(c))
                    .join('')
                  console.log(output)
                  e.target.value = output
                  productions = productions.filter(
                    (prod) => prod.preChar != letter
                  )
                  productions.push({ preChar: letter, successor: output })

                  setProductions(productions)
                }}
              ></input>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
