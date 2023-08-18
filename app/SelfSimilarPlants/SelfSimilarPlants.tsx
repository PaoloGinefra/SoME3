import { Fragment } from 'react'

let TREES = [
    {
        label: 'Romanesco Broccoli',
        img: {
            full: '/assets/SelfSimilar/romanesco.jpg',
        },
        attribution: {
            author: {
                name: 'VENUS MAJOR',
                link: 'https://unsplash.com/it/@venusmajor',
            },
            platform: {
                name: 'Unspash',
                link: 'https://unsplash.com/it/foto/UC8hqc0udqY?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
            },
        },
    },
    {
        label: 'Fern',
        img: {
            full: '/assets/SelfSimilar/fern.jpg',
        },
        attribution: {
            author: {
                name: 'Massimiliano Morosinotto',
                link: 'https://unsplash.com/it/@therawhunter',
            },
            platform: {
                name: 'Unspash',
                link: 'https://unsplash.com/it/foto/sLGfG-pOBeY?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
            },
        },
    },
]



export default function SelfSimilarPlants() {
    return (
        <div className="grid grid-rows-[1fr_auto] grid-flow-col auto-cols-fr gap-4 m-[5%]">
            {TREES.map((tree, i) => (
                <Fragment key={i}>
                    <img
                        className="m-0 p-0 block w-full h-full object-cover rounded-md"
                        src={tree.img.full}
                    />

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
                </Fragment>
            ))}
        </div>);
}