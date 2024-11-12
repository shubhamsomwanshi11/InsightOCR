import React from 'react';
import { FaMoon, FaShare } from "react-icons/fa";

const Header = () => {
    const handleShare = () => {
        const url = window.location.href;
        const title = document.title;

        if (navigator.share) {
            // Web Share API is supported
            navigator.share({
                title: title,
                url: url
            }).catch(error => console.error('Error sharing:', error));
        } else {
            // Fallback: copy link to clipboard
            navigator.clipboard.writeText(url).then(() => {
                alert("Link copied to clipboard!");
            }).catch(error => console.error('Error copying link:', error));
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{ background: 'grey' }}>
            <div className="container-fluid">
                <a className="navbar-brand fw-semibold fs-3" href="/">InsightOCR</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a href="/" className="nav-link active">
                                Home
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="#features" className="nav-link">
                                Features
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="#faq" className="nav-link">
                                FAQs
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="/about" className="nav-link">
                                About
                            </a>
                        </li>
                    </ul>
                    <div className="d-flex">
                        <button className="btn btn-info btn-lg me-1 fw-semibold text-light" onClick={handleShare} type="button">
                            Share <FaShare />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;