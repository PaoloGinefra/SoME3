import React from 'react'
import Production from './Interface/Production'
import classes from './TextLSystem.module.css'

interface AlphabetState {
  alphabet: string
  setAlphabet: (s: string) => void
  productions: Production[]
  setProductions: (p: Production[]) => void
  counter: number
  regenText: (thisProductions?: Array<Production>, thisAxiom?: string) => void
  productionCounter: { [key: string]: number }
  setProductionCounter: (p: {}) => void
}

export default function Alphabet({
  alphabet,
  setAlphabet,
  productions,
  setProductions,
  counter,
  regenText,
  productionCounter,
  setProductionCounter,
}: AlphabetState) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <h1 className="m-auto text-4xl">Alphabet</h1>
      <input
        className="w-80  h-10 m-auto text-center rounded tracking-widest"
        type="text"
        value={alphabet}
        onChange={(e) => {
          let s = e.target.value
          s = s.replace(/[ ||\n]/gi, '')
          s = s.split('').sort().join('')
          let alphabetOutput = s[0]
          for (let i = 1; i < s.length; i++) {
            if (s[i] != s[i - 1]) {
              alphabetOutput += s[i]
            }
          }
          e.target.value = alphabetOutput
          alphabetOutput = alphabetOutput ? alphabetOutput : ''
          setAlphabet(alphabetOutput)
          alphabetOutput.split('').forEach((letter) => {
            if (!productions.some((p) => p.preChar == letter))
              productions.push({ preChar: letter, successors: [letter] })
            if (productionCounter[letter] === undefined)
              setProductionCounter({ ...productionCounter, [letter]: 1 })
          })
          console.log(productions)
          console.log(productionCounter)
          productions.forEach((prod) => {
            prod.successors = prod.successors.map(s =>
              s.split('')
                .filter((ch) => alphabetOutput.includes(ch))
                .join(''))
          })
          productions = productions.filter((prod) =>
            alphabetOutput.includes(prod.preChar)
          )
          setProductions(productions)

          if (counter) regenText(productions)
        }}
      />
    </div>
  )
}
