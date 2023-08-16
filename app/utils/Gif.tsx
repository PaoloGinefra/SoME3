interface GIF_interface {
    url: string;
    width: number;
    height: number;
}

export default function Gif({ url, width, height }: GIF_interface) {
    return (
        <iframe
            className="rounded-xl m-auto"
            src={url}
            width={width}
            height={height}
            allowFullScreen
        ></iframe>
    )

}