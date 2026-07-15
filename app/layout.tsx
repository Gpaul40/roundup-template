import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { groupConfig } from '@/config/group'
import { themeToCss } from '@/config/theme'
import { PreferencesProvider } from '@/lib/preferences'
import './globals.css'

const _geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: groupConfig.appName,
  description: groupConfig.appDescription,
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <head>
        {/* Per-group theme colours (see config/theme.ts) */}
        <style dangerouslySetInnerHTML={{ __html: themeToCss(groupConfig.theme) }} />
      </head>
      <body className={`${_geist.variable} ${_geistMono.variable} font-sans antialiased min-h-screen`}>
        <PreferencesProvider>{children}</PreferencesProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
