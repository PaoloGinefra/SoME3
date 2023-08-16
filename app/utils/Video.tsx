interface Video_interface {
    url: string,
    width: number,
    height: number
}

export default function Video({ url, width, height }: Video_interface) {
    return (
        <div className=" max-w-[90%] overflow-hidden rounded-xl m-auto flex justify-center align-middle">

            <iframe
                className="m-auto my-10 rounded-lg"
                width={width}
                height={height}
                src={url + "&controls=0&autoplay=1&loop=1&modestbranding=1&mute=1"}
                title="YouTube video player"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; modestbranding"
            />
        </div>
    )
}