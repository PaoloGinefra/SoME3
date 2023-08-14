import React from 'react'
import Production from './Interface/Production'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

interface ProductionState {
  productions: Production[]
  setProductions: (p: Production[]) => void
  alphabet: string
  counter: number
  regenText: (thisProductions?: Array<Production>, thisAxiom?: string) => void
}

export default function Productions({
  productions,
  setProductions,
  alphabet,
  counter,
  regenText,
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
                type="text"
                value={
                  productions.find((prod) => prod.preChar == letter)?.successor
                }
                onChange={(e) => {

                  let output = e.target.value
                  output = output
                    .split('')
                    .filter((c) => alphabet.includes(c))
                    .join('')
                  console.log(output)
                  e.target.value = output
                  const outputProductions = productions.filter(
                    (prod) => prod.preChar != letter
                  )
                  outputProductions.push({ preChar: letter, successor: output })
                  console.log(outputProductions);
                  
                  if (counter) regenText(outputProductions)

                  setProductions(outputProductions)
                }}
              ></input>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
