import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'MemoryIQ — Your AI-Powered Second Brain',
  description:
    'Capture thoughts, organize knowledge, and let AI surface insights from your personal knowledge base.',
  openGraph: {
    title: 'MemoryIQ — Your AI-Powered Second Brain',
    description:
      'Capture thoughts, organize knowledge, and let AI surface insights from your personal knowledge base.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MemoryIQ — Your AI-Powered Second Brain',
    description:
      'Capture thoughts, organize knowledge, and let AI surface insights from your personal knowledge base.',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
