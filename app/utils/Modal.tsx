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
    <dialog ref={ref} className="w-11/12 max-w-4xl p-8 space-y-4 rounded-2xl">
      <div>{children}</div>
      <div>
        <button onClick={() => onClose()} className="">
          Close
        </button>
      </div>
    </dialog>
  )
}
