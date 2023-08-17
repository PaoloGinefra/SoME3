import { Fragment } from 'react'

let TREES = [
    {
        label: 'Smoll Tree',
        img: {
            full: '/assets/MultipleScales/smolTree.jpg',
        },
        attribution: {
            author: {
                name: 'Matthew Smith',
                link: 'https://unsplash.com/it/@whale',
            },
            platform: {
                name: 'Unspash',
                link: 'https://unsplash.com/it/foto/Rfflri94rs8?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
            },
        },
    },
    {
        label: 'Algea',
        img: {
            full: '/assets/MultipleScales/algae.jpg',
        },
        attribution: {
            author: {
                name: 'Uros Miloradovic',
                link: 'https://unsplash.com/it/@uroshdotorg',
            },
            platform: {
                name: 'Unspash',
                link: 'https://unsplash.com/it/foto/7bMynojPirs?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
            },
        },
    },
    {
        label: 'Big Tree',
        img: {
            full: '/assets/MultipleScales/bigTree.jpg',
        },
        attribution: {
            author: {
                name: 'Jan Huber',
                link: 'https://unsplash.com/it/@jan_huber',
            },
            platform: {
                name: 'Unspash',
                link: 'https://unsplash.com/it/foto/4OhFZSAT3sw?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
            },
        },
    },
    {
        label: 'Mint',
        img: {
            full: '/assets/MultipleScales/mint.jpg',
        },
        attribution: {
            author: {
                name: 'okeykat',
                link: 'https://unsplash.com/it/@okeykat',
            },
            platform: {
                name: 'Unspash',
                link: 'https://unsplash.com/it/foto/kVkiNOgkjmo?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
            },
        },
    },
]



export default function MultipleScales() {
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