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
    <div className="flex flex-col gap-4 mb-4">
      <h1 className="m-auto text-4xl">Axioms</h1>
      <input
        className="w-80  h-10 m-auto text-center rounded tracking-widest"
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
  )
}
