import TurtleSketch from './TurtleSketch'
import { toCmdSeq } from './turtleCommands'

// TODO: delete this temporary page
export default function Page() {
  return (
    <TurtleSketch
      allowedCommands={toCmdSeq('Ff+-T[]')}
      defaultSeq={toCmdSeq('FF[+F[+F]]F-F')}
    />
  )
}
