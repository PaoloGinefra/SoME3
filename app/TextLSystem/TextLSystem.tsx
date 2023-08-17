'use client'

import React, { useState } from 'react'
import Alphabet from './Alphabet'
import Productions from './Productions'
import Axiom from './Axiom'
import Production from './Interface/Production'

export default function TextLSystem() {
  const [alphabet, setAlphabet] = useState('')
  const [productions, setProductions] = useState(Array<Production>)
  const [axiom, setAxiom] = useState('')
  const [counter, setCounter] = useState(0)
  const [output, setOutput] = useState('')

  function regenText(thisProductions = productions, thisAxiom = axiom): void {
    let text = thisAxiom
    for (let i = 0; i < counter; i++) {
      text = applyProductions(text, thisProductions)
    }
    setOutput(text)
  }

  function applyProductions(
    text: string,
    thisProductions: Array<Production>
  ): string {
    return text
      .split('')
      .map((letter) => {
        const selectedProduction = thisProductions.find(
          (prod) => prod.preChar == letter
        )
        if (selectedProduction && selectedProduction.successor)
          return selectedProduction.successor
        return letter
      })
      .join('')
  }

  function nextText(): void {
    if (!counter) {
      setOutput(axiom)
    } else {
      setOutput(applyProductions(output, productions))
    }
    setCounter(counter + 1)
  }

  function resetText(): void {
    setCounter(0)
    setOutput('')
  }

  return (
    <div className="my-20">
      <Alphabet
        alphabet={alphabet}
        setAlphabet={setAlphabet}
        productions={productions}
        setProductions={setProductions}
        counter={counter}
        regenText={regenText}
      />
      <Productions
        productions={productions}
        setProductions={setProductions}
        alphabet={alphabet}
        counter={counter}
        regenText={regenText}
      />
      <Axiom
        alphabet={alphabet}
        axiom={axiom}
        setAxiom={setAxiom}
        counter={counter}
        regenText={regenText}
      />
      <div className="flex flex-col gap-4 mb-4">
        <h1 className="m-auto text-4xl">Output</h1>
        <div className="m-auto text-4xl flex">
          <button
            title={counter ? 'Next' : 'Start'}
            className="mx-2 px-3 border-none"
            onClick={() => nextText()}
          >
            ▶
          </button>
          <button
            title="Reset"
            className="mx-2 px-3 border-none"
            onClick={() => resetText()}
          >
            ✖
          </button>
        </div>
      </div>
      <div className="flex flex-row-reverse min-[500px]:mx-16 max-[500px]:mx-8">
        <h1
          title="Iterations"
          className="text-2xl align-center text-right border border-solid px-2 rounded"
        >
          {counter} ⏲
        </h1>
      </div>
      <div
        className="break-words border-solid border-2 border-white rounded p-4 my-4 min-[500px]:mx-16 max-[500px]:mx-8"
        style={{ minHeight: '8em' }}
      >
        {output}
      </div>
    </div>
  )
}
