import React from 'react'
import Production from './Interface/Production'
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

interface ProductionState {
  productions: Production[]
  setProductions: (p: Production[]) => void
  alphabet: string
  counter: number
  regenText: (thisProductions?: Array<Production>, thisAxiom?: string) => void
  productionCounter: { [key: string]: number }
  setProductionCounter: (p: {}) => void,
  stochastic: boolean,
}

export default function Productions({
  productions,
  setProductions,
  alphabet,
  counter,
  regenText,
  productionCounter,
  setProductionCounter,
  stochastic,
}: ProductionState) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <h1 className="m-auto text-4xl">Productions</h1>
      <ul className="flex flex-col gap-4 max-h-[50vh] w-[80vw] overflow-y-scroll m-auto">
        {!alphabet ? (
          <li className="w-80 m-auto tracking-widest flex items-center justify-stretch">
            <p className="font-mono m-2">… →</p>
            <input
              type="text"
              disabled
              className="grow h-10 px-2 text-left rounded"
            />
          </li>
        ) : (
          alphabet.split('').map((letter) => (
            Array.from({ length: productionCounter[letter] }).map((_, index) => (
              <li className="relative m-auto tracking-widest flex items-center justify-stretch">
                <p className="font-mono m-2">{letter} →</p>

                <input
                  className={'grow h-10 px-2 text-left rounded'}
                  type="text"
                  value={
                    productions.find((prod) => prod.preChar == letter)?.successors[index]
                  }
                  onChange={(e) => {
                    let output = e.target.value
                    output = output
                      .split('')
                      .filter((c) => alphabet.includes(c))
                      .join('')
                    console.log(output)
                    e.target.value = output

                    const prod = productions.find((prod) => prod.preChar == letter)
                    if (!prod) {
                      productions.push({ preChar: letter, successors: [output] })
                    }
                    else {
                      prod.successors[index] = output
                    }
                    console.log(productions);

                    if (counter) regenText(productions);

                    setProductions([...productions]);
                  }
                  }
                ></input>
                {index == productionCounter[letter] - 1 && stochastic ?
                  (
                    <div className='absolute right-0 flex justify-center my-3 translate-x-[100%]'>
                      <button
                        className="ml-2 px-2 py-1 text-sm"
                        onClick={() => {
                          setProductionCounter({
                            ...productionCounter,
                            [letter]: productionCounter[letter] + 1,
                          })
                          let prod = productions.find((prod) => prod.preChar == letter)
                          if (prod)
                            prod.successors.push('')

                          if (counter) regenText(productions)
                          setProductions(productions);
                        }}> <AiOutlineDown /> </button>

                      {
                        productionCounter[letter] > 1 ?
                          (<button
                            className="ml-2 px-2 py-1 text-sm"
                            onClick={() => {
                              setProductionCounter({
                                ...productionCounter,
                                [letter]: productionCounter[letter] - 1,
                              })
                              productions.find((prod) => prod.preChar == letter)?.successors.pop()
                              if (counter) regenText(productions)
                              setProductions([...productions]);
                            }}> <AiOutlineUp /> </button>) : null
                      }
                    </div>
                  ) : null
                }
              </li>
            ))
          ))
        )}
      </ul>
    </div>
  )
}
