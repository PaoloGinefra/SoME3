interface Video_interface {
    url: string
}

export default function Video({ url }: Video_interface) {
    return (
        <iframe
            className="m-auto my-10 rounded-lg"
            width="560"
            height="315"
            src={url + "&controls=0&autoplay=1&loop=1&modestbranding=1&mute=1"}
            title="YouTube video player"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; modestbranding"
        />
    )
}