import { useEffect } from 'react'

interface CharPicker_State {
    alphabet: string
    currentChar: string
    setcurrentChar: (char: string) => void
}

export default function CharPicker({ alphabet, currentChar, setcurrentChar }: CharPicker_State) {
    useEffect(() => {
        setcurrentChar(alphabet[0])
    }, [alphabet])
    return (
        <select className="m-2 text-4xl rounded"
            onChange={e => setcurrentChar(e.target.value)}
            value={currentChar}
        >
            {
                alphabet.split('').map((char, i) => {
                    return (
                        <option key={i} className="text-2xl">
                            {char}
                        </option>
                    )
                })
            }
        </select>
    )
}