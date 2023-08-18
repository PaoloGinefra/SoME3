export default function Prose(props: any) {
  return <div className="mx-auto prose prose-lg prose-invert max-w-3xl text-justify break-words">{props.children}</div>
}
