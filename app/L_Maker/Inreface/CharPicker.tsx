
interface CharPicker_State {
    alphabet: string
    currentChar: string
    setcurrentChar: (char: string) => void
}

export default function CharPicker({ alphabet, currentChar, setcurrentChar }: CharPicker_State) {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', margin: '20px' }}>
            {
                alphabet.split('').map((char, i) => {
                    return (
                        <button key={i} style={{ borderRadius: '5px', padding: '8px', fontSize: '10px', "transform": (currentChar == char ? "scale(1.2)" : "") }}
                            onClick={() => setcurrentChar(char)}
                        >
                            {char}
                        </button>
                    )
                })
            }
        </div>
    )
}