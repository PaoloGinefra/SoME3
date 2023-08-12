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
    <div className={classes['container']}>
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
      <div className={classes['container-bar']}>
        <h2>Output</h2>
        <button className={classes['start']} onClick={() => nextText()}>
          ▶
        </button>
        <button className={classes['stop']} onClick={() => resetText()}>
          ✖
        </button>
      </div>
      <div className={classes['container']}>{output}</div>
    </div>
  )
}
