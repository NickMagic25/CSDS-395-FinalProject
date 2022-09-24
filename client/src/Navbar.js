export default function Navbar() {
    return <nav className="nav">
        <ul>
            <li>
                <a href="/about">About</a>
            </li>
            <li>
                <a href="/contact">Contact</a>
            </li>
        </ul>
        <a href="/" className="site-title">InstaJacked</a>
        <ul>
            <li>
                <a href="/login">Login</a>
            </li>
            <li>
                <a href="/signup">Sign Up For Free</a>
            </li>
        </ul>
    </nav>

}