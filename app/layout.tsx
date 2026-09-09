import type {Metadata} from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Yangnar Studio — Architecture, Craft & Place',
  description: 'A Chiang Mai architecture and design-build practice working with climate, craft and local knowledge.',
}

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
