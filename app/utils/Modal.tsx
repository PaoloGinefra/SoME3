import { ReactNode, useEffect, useRef } from 'react'

export interface ModalProps {
  children: ReactNode
  open: boolean
  onClose: () => void
}

export default function Modal({ children, open, onClose }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current!

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  })

  useEffect(() => {
    const dialog = ref.current!

    const handleCancel = (event: Event) => {
      event.preventDefault()
      onClose()
    }

    dialog.addEventListener('cancel', handleCancel)
    return () => {
      dialog.removeEventListener('cancel', handleCancel)
    }
  })

  return (
    <>
      <dialog ref={ref} className=' overflow-hidden'>
        <div className='fixed top-0 left-0 w-full h-full backdrop-blur-sm -z-10' />
        <div className="w-11/12 max-w-4xl p-8 space-y-4 rounded-2xl border-2 m-auto bg-black">
          <div>{children}</div>
          <div className='fixed top-0 right-0 -translate-x-5 -translate-y-15'>
            <button onClick={() => onClose()} className="">
              ✖️
            </button>
          </div>
        </div>

      </dialog>
    </>
  )
}
