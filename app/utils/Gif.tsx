interface GIF_interface {
    url: string;
    width: number;
    height: number;
}

export default function Gif({ url, width, height }: GIF_interface) {
    return (
        <div className=" max-w-[90%] overflow-hidden rounded-xl m-auto flex justify-center align-middle" style={{ aspectRatio: width / height }}>
            <iframe
                className="relative rounded-xl m-auto"
                style={{ aspectRatio: width / height, transform: "scale(" + (1) + ")" }}
                src={url}
                width={width}
                height={height}
                allowFullScreen
            ></iframe>
        </div >
    )

}