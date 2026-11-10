import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AgroControl | Gemelo Digital 3D & Monitoreo Agrícola',
  description:
    'Plataforma de investigación aplicada y monitoreo en tiempo real de invernaderos inteligentes (ESPOCH / AgroControl).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-[#041f1b] text-[#edf6f0]">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
