import React from 'react'
import Production from './Interface/Production'
import classes from './TextLSystem.module.css'

interface AxiomState {
  alphabet: string
  axiom: string
  setAxiom: (s: string) => void
  counter: number
  regenText: (thisProductions?: Array<Production>, thisAxiom?: string) => void
}

export default function Alphabet({
  alphabet,
  axiom,
  setAxiom,
  counter,
  regenText,
}: AxiomState) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <h1 className="m-auto text-4xl">Axioms</h1>
      <input
        className="w-80  h-10 m-auto text-center rounded tracking-widest"
        type="text"
        value={axiom}
        onChange={(e) => {
          let axiomOutput = e.target.value
          axiomOutput = axiomOutput
            .split('')
            .filter((c) => alphabet.includes(c))
            .join('')
          setAxiom(axiomOutput)
          if (counter) regenText(undefined, axiomOutput)
        }}
      />
    </div>
  )
}
