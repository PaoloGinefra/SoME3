interface ModeButton_State {
    Modes: string[];
    mode: string;
    setMode: (modeName: string) => void;
}


export default function ModeButtons({ Modes, mode, setMode }: ModeButton_State) {
    return (
        <div className="flex text-sm justify-center mt-10">
            {
                Modes.map((m) => {
                    return (<button key={m} style={{ "transform": (mode == m ? "scale(1.2)" : "") }}
                        onClick={() => setMode(m)}
                    > {m}</button >)
                })
            }
        </div>

    )
}