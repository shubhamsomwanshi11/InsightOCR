import React from 'react'

const Footer = () => {
    return (
        <footer className="d-flex flex-wrap mt-5 bg-body-tertiary justify-content-between align-items-center py-3 px-5 my-4 border-top">
            <p className="col-md-4 fs-5 mb-0 text-muted">© 2024 <a href="https://shubhamsomwanshi11.vercel.app/">@shubhamsomwanshi11</a></p>

            <a href="/" className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                <svg className="bi me-2" width="40" height="32"><use href="#bootstrap"></use></svg>
            </a>

            <ul className="nav col-md-4 justify-content-end">
                <li className="nav-item"><a href="/" className="nav-link px-2 text-muted">Home</a></li>
                <li className="nav-item"><a href="#features" className="nav-link px-2 text-muted">Features</a></li>
                <li className="nav-item"><a href="#faq" className="nav-link px-2 text-muted">FAQs</a></li>
                <li className="nav-item"><a href="about" className="nav-link px-2 text-muted">About</a></li>
            </ul>
        </footer>
    )
}

export default Footer