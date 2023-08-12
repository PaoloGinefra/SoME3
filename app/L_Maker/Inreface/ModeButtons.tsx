interface ModeButton_State {
    Modes: string[];
    mode: string;
    setMode: (modeName: string) => void;
}


export default function ModeButtons({ Modes, mode, setMode }: ModeButton_State) {
    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            {
                Modes.map((m) => {
                    return (<button key={m} style={{ "margin": "0.5em", "padding": "0.5em", "transform": (mode == m ? "scale(1.2)" : "scale(1)") }}
                        onClick={() => setMode(m)}
                    > {m}</button >)
                })
            }
        </div>

    )
}