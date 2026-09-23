import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Product Admin Dashboard',
  description: 'Manage your product catalog with ease.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`} style={{ backgroundColor: '#1c1007', color: '#fde8c8' }}>
        {children}
      </body>
    </html>
  );
}
