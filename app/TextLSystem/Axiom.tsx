import React from 'react'
import classes from './TextLSystem.module.css'

interface AxiomState {
  alphabet: string
  axiom: string
  setAxiom: (s: string) => void
  active: boolean
}

export default function Alphabet({
  alphabet,
  axiom,
  setAxiom,
  active,
}: AxiomState) {
  return (
    <div>
      <div className={classes['container-bar']}>
        <h3>Axioms</h3>
      </div>
      <div className={classes['container']}>
        <input
          disabled={active}
          type="text"
          value={axiom}
          onChange={(e) => {
            let output = e.target.value
            output = output
              .split('')
              .filter((c) => alphabet.includes(c))
              .join('')
            setAxiom(output)
          }}
        />
      </div>
    </div>
  )
}
