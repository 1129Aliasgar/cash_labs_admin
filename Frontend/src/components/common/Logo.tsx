import Image from 'next/image';

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
}

export function Logo({ className = '', width = 197, height = 48 }: LogoProps) {
    return (
        <div className={`relative ${className}`} style={{ width, height }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/cashlabs-logo.png"
                alt="CashLabs"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
        </div>
    );
}
