import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai'
import Prose from './Prose'

interface Props {
  title: string
  children: React.ReactNode
  opened: boolean
  restProps?: any
}

export default function Toggleable({
  children,
  title,
  opened = true,
  ...restProps
}: Props) {
  const [open, setOpen] = useState(opened)

  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | null>(null)
  const maxHeigth = !!height ? height + 'px' : 'none'

  useEffect(() => {
    setHeight(ref.current!.scrollHeight)
  }, [])

  return (
    <div className="mt-4">
      <div className="cursor-pointer" onClick={() => setOpen(!open)}>
        <Prose>
          <h2 className="flex flex-row gap-2">
            <div className="my-auto">
              {open ? <AiOutlineUp /> : <AiOutlineDown />}
            </div>
            {title}
          </h2>
        </Prose>
      </div>
      <div
        ref={ref}
        style={{
          maxHeight: open ? maxHeigth : '0px',
          overflow: 'hidden',
          transitionDuration: '1s',
          transitionProperty: 'max-height',
          transitionTimingFunction: 'ease-in-out',
        }}
        className="rounded-lg"
      >
        {children}
      </div>
    </div>
  )
}
