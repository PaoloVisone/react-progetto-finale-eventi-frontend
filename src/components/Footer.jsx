import '../css/Footer.css'
export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <p>© {new Date().getFullYear()} Tutti i diritti riservati.</p>
                <div className="footer-links">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Termini e Condizioni</a>
                </div>
            </div>
        </footer>
    );
}