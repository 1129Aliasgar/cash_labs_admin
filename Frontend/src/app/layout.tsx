import type { Metadata } from 'next';
import './globals.css';
import { ReactQueryProvider } from '@/lib/queryClient';

export const metadata: Metadata = {
    title: 'PSPManager — Payment Service Provider Dashboard',
    description: 'Secure multi-gateway routing network for merchants. PCI DSS compliant.',
    robots: 'noindex, nofollow', // Admin dashboard — no public indexing
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <ReactQueryProvider>{children}</ReactQueryProvider>
            </body>
        </html>
    );
}
