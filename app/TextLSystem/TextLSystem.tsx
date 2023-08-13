'use client'

import React, { useState } from 'react'
import Alphabet from './Alphabet'
import Productions from './Productions'
import Axiom from './Axiom'
import Production from './Interface/Production'

import classes from './TextLSystem.module.css'

export default function TextLSystem() {
  const [alphabet, setAlphabet] = useState('')
  const [productions, setProductions] = useState(Array<Production>)
  const [axiom, setAxiom] = useState('')
  const [active, setActive] = useState(false)
  const [output, setOutput] = useState('')

  function nextText(): void {
    if (!active) {
      setActive(true)
      setOutput(axiom)
    } else {
      setOutput(
        output
          .split('')
          .map((letter) => {
            const selectedProduction = productions.find(
              (prod) => prod.preChar == letter
            )
            if (selectedProduction && selectedProduction.successor)
              return selectedProduction.successor
            return letter
          })
          .join('')
      )
    }
  }

  function resetText(): void {
    setActive(false)
    setOutput('')
  }

  return (
    <div className="my-20">
      <Alphabet
        alphabet={alphabet}
        setAlphabet={setAlphabet}
        productions={productions}
        setProductions={setProductions}
        active={active}
      />
      <Productions
        productions={productions}
        setProductions={setProductions}
        alphabet={alphabet}
        active={active}
      />
      <Axiom
        alphabet={alphabet}
        axiom={axiom}
        setAxiom={setAxiom}
        active={active}
      />
      <div className="flex flex-col gap-4 mb-4">
        <h1 className="m-auto text-4xl">Output</h1>
        <div className="m-auto text-4xl">
          <button
            title={active ? 'Next' : 'Start'}
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
      <div
        className="break-words border-solid border-2 border-white rounded p-4 mx-32 my-4"
        style={{ minHeight: '8em' }}
      >
        {output}
      </div>
    </div>
  )
}