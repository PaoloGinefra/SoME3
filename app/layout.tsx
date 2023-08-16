import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'How to programmatically touch grass',
  description: 'A SoME3 entry on drawing plants programmatically.',
  image: 'https://howtoprogrammaticallytouchgrass.vercel.app/og.png',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
