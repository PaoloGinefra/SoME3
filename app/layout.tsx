import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'How to programmatically touch grass',
  description: 'A SoME3 entry on drawing plants procedurally.',
  'og:image': 'https://howtoprogrammaticallytouchgrass.vercel.app/og.png',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata['og:image']} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
