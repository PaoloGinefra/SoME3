'use client'

import React, { useState, useEffect } from 'react'
import Alphabet from './Alphabet'
import Productions from './Productions'
import Axiom from './Axiom'
import Production from './Interface/Production'
import StringRenderer from './Renderer'
import { TbReload } from 'react-icons/tb'
import { FaBackward, FaForward } from 'react-icons/fa'
import { AiTwotoneDelete } from 'react-icons/ai'

interface TextLSystemProps {
  stochastic: boolean,
}


export default function TextLSystem({ stochastic = false }) {
  const [alphabet, setAlphabet] = useState('')
  const [productions, setProductions] = useState(Array<Production>)
  const [axiom, setAxiom] = useState('')
  const [counter, setCounter] = useState(0)
  const [output, setOutput] = useState('')

  const [proctionCounter, setProductionCounter] = useState({})

  useEffect(() => {
    setAlphabet('+-[]F')
    setProductions([
      { preChar: 'F', successors: ['F'] },
      { preChar: '+', successors: ['+'] },
      { preChar: '-', successors: ['-'] },
      { preChar: '[', successors: ['['] },
      { preChar: ']', successors: [']'] },
    ])
    setAxiom('F')
    setProductionCounter({ 'F': 1, '+': 1, '-': 1, '[': 1, ']': 1 })
  }, [])

  function regenText(thisProductions = productions, thisAxiom = axiom): void {
    let text = thisAxiom
    for (let i = 0; i < counter; i++) {
      text = applyProductions(text, thisProductions)
    }
    setOutput(text)
  }

  function applyProductions(text: string, thisProductions: Array<Production>): string {
    return text
      .split('')
      .map((letter) => {
        const selectedProduction = thisProductions.find(
          (prod) => prod.preChar == letter
        )
        if (selectedProduction && selectedProduction.successors) {
          let i = Math.floor(Math.random() * selectedProduction.successors.length)
          return selectedProduction.successors[i]
        }
        return letter
      })
      .join('')
  }

  function lastText(): void {
    if (counter > 1) {
      setCounter(counter - 1)
      let text = axiom
      for (let i = 0; i < counter - 1; i++) {
        text = applyProductions(text, productions)
      }
      setOutput(text)
    }
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
        productionCounter={proctionCounter}
        setProductionCounter={setProductionCounter}
      />
      <Productions
        productions={productions}
        setProductions={setProductions}
        alphabet={alphabet}
        counter={counter}
        regenText={regenText}
        productionCounter={proctionCounter}
        setProductionCounter={setProductionCounter}
        stochastic={stochastic}
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
            title='Go back'
            className="mx-2 px-3 border-none"
            onClick={() => lastText()}
            disabled={counter <= 1}
          >
            <FaBackward />
          </button>

          {stochastic ?
            <button
              title="Regen"
              className="mx-2 px-3 border-none"
              onClick={() => regenText()}
            >
              <TbReload />
            </button> : null
          }

          <button
            title={counter ? 'Next' : 'Start'}
            className="mx-2 px-3 border-none"
            onClick={() => nextText()}
          >
            <FaForward />
          </button>

          <button
            title="Reset"
            className="mx-2 px-3 border-none"
            onClick={() => resetText()}
          >
            ✖
          </button>

          <button
            title="Clear"
            className="mx-2 px-3 border-none"
            onClick={() => {
              setAlphabet('+-[]F')
              setProductions([
                { preChar: 'F', successors: ['F'] },
                { preChar: '+', successors: ['+'] },
                { preChar: '-', successors: ['-'] },
                { preChar: '[', successors: ['['] },
                { preChar: ']', successors: [']'] },
              ])
              setAxiom('F')
              setProductionCounter({ 'F': 1, '+': 1, '-': 1, '[': 1, ']': 1 })
            }}
          >
            <AiTwotoneDelete />
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
        className="break-words border-solid border-2 border-white rounded p-4 mx-16 my-4 h-1 overflow-y-scroll text-justify"
        style={{ minHeight: '8em' }}
      >
        {output}
      </div>

      {
        stochastic ?
          <div className='flex flex-col justify-center'>

            <h1 className="m-auto text-4xl">Turtule Render</h1>

            <div className='m-auto'>
              <StringRenderer String={output} />
            </div>
          </div> : null
      }


    </div>

  )
}
