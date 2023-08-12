import React from 'react'
import Production from './Interface/Production'
import classes from './TextLSystem.module.css'

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
    <div>
      <div className={classes['container-bar']}>
        <h3>Productions</h3>
      </div>
      <div className={classes['container']}>
        <ul>
          {alphabet?.split('').map((letter) => (
            <li>
              {letter} →{' '}
              <input
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
          ))}
        </ul>
      </div>
    </div>
  )
}
