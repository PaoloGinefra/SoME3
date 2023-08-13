interface ModeButton_State {
    Modes: string[];
    mode: string;
    setMode: (modeName: string) => void;
    modesIcons: JSX.Element[];
}


export default function ModeButtons({ Modes, mode, setMode, modesIcons }: ModeButton_State) {
    return (
        <div className="flex text-sm justify-center mt-10 gap-5">
            {
                Modes.map((m, i) => {
                    return (<button
                        className="p-2"
                        key={m} style={{ "transform": (mode == m ? "scale(1.2)" : "") }}
                        onClick={() => setMode(m)}
                    >{modesIcons[i]}</button >)
                })
            }
        </div>

    )
}