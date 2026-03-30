import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Orca — Creative Agency',
  description: 'A creative agency born in the Middle East, built on strength, intelligence, and connection.',
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
