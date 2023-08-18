interface GIF_interface {
    url: string;
    width: number;
    height: number;
}

export default function Gif({ url, width, height }: GIF_interface) {
    return (
        <div className=" max-w-[90%] overflow-hidden rounded-xl m-auto flex justify-center align-middle">
            <iframe
                className="rounded-xl m-auto object-cover"
                style={{ aspectRatio: width / height }}
                src={url}
                width={width}
                height={height}
                allowFullScreen
            ></iframe>
        </div >
    )

}