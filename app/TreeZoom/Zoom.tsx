import { useState, Fragment } from "react"

const TREES = [
    {
        label: 'Tree',
        img: {
            full: '/assets/zoomTree/ZoomTree.jpg',
        },
        attribution: {
            author: {
                name: 'Raychan',
                link: 'https://unsplash.com/it/@wx1993?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
            },
            platform: {
                name: 'Unspash',
                link: 'https://unsplash.com/it/foto/iAlerP-CnBY?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
            },
        },
        waypoints: [
            { scale: 1, x: 0, y: 0, rot: 0 },
            { scale: 2.5, x: -25, y: 0, rot: -50 },
            { scale: 4.5, x: -40, y: 5, rot: -45 },
            { scale: 15, x: -32.5, y: -17, rot: 25 },
        ]
    },
]

export default function Zoom() {
    const [state, setState] = useState(TREES[0].waypoints[0])

    function lerp(t: number, base: number, target: number) {
        return (1 - t) * base + t * target
    }

    function smoothstep(t: number) {
        return t * t * t * (3 * t * (2 * t - 5) + 10);
    }

    function getState(t: number, waypoints: any[]) {
        let n = waypoints.length - 1;
        let i = Math.floor(t * n)
        let normT = smoothstep((t % (1 / n)) * n)

        if (i === n) return waypoints[n];

        let state = {
            scale: lerp(normT, waypoints[i].scale, waypoints[i + 1].scale),
            x: lerp(normT, waypoints[i].x, waypoints[i + 1].x),
            y: lerp(normT, waypoints[i].y, waypoints[i + 1].y),
            rot: lerp(normT, waypoints[i].rot, waypoints[i + 1].rot),
        }

        return state;
    }

    return (
        <div className="my-8 mx-auto space-y-4 max-w-screen-lg">
            <fieldset>
                <div className="flex justify-center space-x-2">
                    <span>Zoom</span>
                    <input
                        className="w-1/2"
                        id="opacitySlider"
                        type="range"
                        min={0}
                        max={1}
                        step={0.001}
                        onChange={(e) => setState(getState(parseFloat(e.target.value), TREES[0].waypoints))}
                    />
                </div>
            </fieldset>

            <div className="">
                {TREES.map((tree, i) => (
                    <div key={i} className="m-auto">
                        <div className="overflow-hidden rounded-lg">
                            <img
                                className="p-0 w-[50%] h-full rounded-md m-auto duration-75"
                                style={{ transform: `scale(${state.scale}) translate(${state.x}%, ${state.y}%) rotate(${state.rot}deg)` }}
                                src={tree.img.full}
                            />
                        </div>

                        <p className="text-sm">
                            Photo by{' '}
                            <a className="underline" href={tree.attribution.author.link}>
                                {tree.attribution.author.name}
                            </a>{' '}
                            on{' '}
                            <a className="underline" href={tree.attribution.platform.link}>
                                {tree.attribution.platform.name}
                            </a>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}