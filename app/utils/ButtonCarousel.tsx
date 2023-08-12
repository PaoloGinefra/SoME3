
interface ButtonCarousel_Interface {
    option: any,
    setOption: any,
    options: any[],
    optionsNames: string[]
}

export default function ButtonCarousel({ option, setOption, options, optionsNames }: ButtonCarousel_Interface) {
    return <div>
        {options.map((op, i) =>
            <button
                onClick={() => setOption(op)}
                style={{
                    "margin": "0.5em",
                    "padding": "0.5em",
                    "transform": (op == option ? "scale(1.2)" : "scale(1)")
                }}
            >{optionsNames[i]}</button>
        )}
    </div>
}