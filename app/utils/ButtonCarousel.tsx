import Image from 'next/image'

interface ButtonCarousel_Interface {
    option: any,
    setOption: any,
    options: any[],
    optionsNames: (string | any)[]
}

export default function ButtonCarousel({ option, setOption, options, optionsNames }: ButtonCarousel_Interface) {
    return <div className='m-auto'>
        {options.map((op, i) =>
            <button
                className='w-20 h-20 m-auto text-3xl'
                onClick={() => setOption(op)}
                style={{
                    "margin": "0.5em",
                    "padding": "0.5em",
                    "transform": (op == option ? "scale(1.2)" : "")
                }}
            >{optionsNames[i]}</button>
        )}
    </div>
}