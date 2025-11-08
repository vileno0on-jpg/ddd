import { ClientLayout } from '@/components/providers/ClientLayout'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}
