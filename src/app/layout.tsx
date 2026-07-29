import type { Metadata } from 'next'
import { Inter, Cinzel } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', weight: ['400', '600', '700'] })

export const metadata: Metadata = {
  title: 'EduPortal NG — Nigerian School Result Management System',
  description: 'Online result checking, grade management, and school administration portal for Nigerian secondary schools. JSS & SSS result checker with WAEC/NECO grading.',
  keywords: 'Nigeria school results, WAEC grades, secondary school portal, JSS SSS results checker',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
