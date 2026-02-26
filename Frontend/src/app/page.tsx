export default function Home() {
    // Redirect root to login (middleware also handles this, this is a fallback)
    return (
        <meta httpEquiv="refresh" content="0; url=/auth/login" />
    );
}
