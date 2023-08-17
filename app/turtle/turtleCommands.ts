import type p5 from 'p5'

export interface TurtleState {
  pos: { x: number; y: number }
  rot: number
}

export type CmdDrawFunction = (
  p: p5,
  stack: TurtleState[],
  params: number[],
  t: number
) => void

const cmdForwardAndDraw: CmdDrawFunction = (p, stack, params, t) => {
  const state = stack[stack.length - 1]
  const [len] = params

  p.push()
  p.translate(state.pos.x, state.pos.y)
  p.rotate(state.rot)

  p.stroke('#0070A9')
  p.strokeWeight(1)
  p.line(0, 0, len * t, 0)

  p.pop()

  state.pos.x += len * t * Math.cos(state.rot)
  state.pos.y += len * t * Math.sin(state.rot)
}

const cmdForward: CmdDrawFunction = (p, stack, params, t) => {
  const state = stack[stack.length - 1]
  const [len] = params

  state.pos.x += len * t * Math.cos(state.rot)
  state.pos.y += len * t * Math.sin(state.rot)
}

const cmdTurnLeft: CmdDrawFunction = (p, stack, params, t) => {
  const state = stack[stack.length - 1]
  const [angle] = params
  state.rot += angle * t
}

const cmdTurnRight: CmdDrawFunction = (p, stack, params, t) => {
  const state = stack[stack.length - 1]
  const [angle] = params
  state.rot -= angle * t
}

const cmdT: CmdDrawFunction = (p, stack, params, t) => {
  // no-op
}

const cmdStackPush: CmdDrawFunction = (p, stack, params, t) => {
  const state = stack[stack.length - 1]
  const copiedState = {
    pos: { x: state.pos.x, y: state.pos.y },
    rot: state.rot,
  }
  stack.push(copiedState)
}

const cmdStakPop: CmdDrawFunction = (p, stack, params, t) => {
  stack.pop()
}

export const TurtleCmds = {
  F: cmdForwardAndDraw,
  f: cmdForward,
  '+': cmdTurnLeft,
  '-': cmdTurnRight,
  T: cmdT,
  '[': cmdStackPush,
  ']': cmdStakPop,
}

export type CmdChar = keyof typeof TurtleCmds

export function isCmdChar(char: string): char is CmdChar {
  return Object.keys(TurtleCmds).includes(char)
}

export type CmdSeq = CmdChar[]

export function isCmdSeq(str: string[]): str is CmdSeq {
  return str.every((char) => isCmdChar(char))
}

export function toCmdSeq(str: string) {
  const seq = str.split('')

  if (!isCmdSeq(seq)) {
    throw new Error('Check your sequence!')
  }

  return seq
}
