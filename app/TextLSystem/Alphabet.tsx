import React from 'react'
import Production from './Interface/Production'
import classes from './TextLSystem.module.css'

interface AlphabetState {
  alphabet: string
  setAlphabet: (s: string) => void
  productions: Production[]
  setProductions: (p: Production[]) => void
  active: boolean
}

export default function Alphabet({
  alphabet,
  setAlphabet,
  productions,
  setProductions,
  active,
}: AlphabetState) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <h1 className="m-auto text-4xl">Alphabet</h1>
      <input
        className="w-80  h-10 m-auto text-center rounded tracking-widest"
        disabled={active}
        type="text"
        value={alphabet}
        onChange={(e) => {
          let s = e.target.value
          s = s.replace(/[ ||\n]/gi, '')
          s = s.split('').sort().join('')
          let output = s[0]
          for (let i = 1; i < s.length; i++) {
            if (s[i] != s[i - 1]) {
              output += s[i]
            }
          }
          e.target.value = output
          output = output ? output : ''
          setAlphabet(output)
          output.split('').forEach((letter) => {
            if (!productions.some((p) => p.preChar == letter))
              productions.push({ preChar: letter, successor: '' })
          })
          productions.forEach((prod) => {
            prod.successor = prod.successor
              .split('')
              .filter((ch) => output.includes(ch))
              .join('')
          })
          productions = productions.filter((prod) =>
            output.includes(prod.preChar)
          )

          setProductions(productions)
        }}
      />
    </div>
  )
}
