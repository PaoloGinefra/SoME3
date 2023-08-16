interface Video_interface {
    url: string
}

export default function Video({ url }: Video_interface) {
    return (
        <iframe
            className="m-auto my-10 rounded-lg"
            width="560"
            height="315"
            src={url}
            title="YouTube video player"
            allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
    )
}