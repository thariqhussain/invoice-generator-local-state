import { useState, useEffect } from 'react';
import './AuthLayout.css';
import invoiceImage from '../../assets/invoice.png'
import networkLogo from '../../assets/network.png'
import moneyFlow from '../../assets/moneyFlow.png'

export default function AuthLayout({ children, triggerSignout = false }) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [displayedText, setDisplayedText] = useState('');
    const fullText = 'Invoice Generator';
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const [showCredentials, setShowCredentials] = useState(false);
    const [copiedField, setCopiedField] = useState(null);

    useEffect(() => {
        setIsSigningOut(triggerSignout);
    }, [triggerSignout]);

    // Typing animation
    useEffect(() => {
        if (isLoggedIn) {
            setDisplayedText('');
            return;
        }
        
        if (displayedText.length < fullText.length) {
            const timer = setTimeout(() => {
                setDisplayedText(fullText.slice(0, displayedText.length + 1));
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [displayedText, isLoggedIn]);

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className={`auth-layout ${isAnimating ? 'animate-to-logo' : ''} ${isSigningOut ? 'animate-to-signin' : ''}`}>
            {/* Credentials Hint Box */}
            <div className="credentials-hint-container">
                <button 
                    className="credentials-hint-button"
                    onClick={() => setShowCredentials(!showCredentials)}
                >
                    🔑 Demo Credentials
                </button>
                
                {showCredentials && (
                    <div className="credentials-popup">
                        <div className="credentials-header">
                            <span>Test Account</span>
                            <button 
                                className="credentials-close"
                                onClick={() => setShowCredentials(false)}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="credential-item">
                            <label>Organization</label>
                            <div className="credential-value">
                                <span>MyOrg</span>
                                <button 
                                    onClick={() => copyToClipboard('MyOrg', 'org')}
                                    className="copy-btn"
                                >
                                    {copiedField === 'org' ? '✓' : '📋'}
                                </button>
                            </div>
                        </div>
                        
                        <div className="credential-item">
                            <label>Email</label>
                            <div className="credential-value">
                                <span>admin@example.com</span>
                                <button 
                                    onClick={() => copyToClipboard('admin@example.com', 'email')}
                                    className="copy-btn"
                                >
                                    {copiedField === 'email' ? '✓' : '📋'}
                                </button>
                            </div>
                        </div>
                        
                        <div className="credential-item">
                            <label>Password</label>
                            <div className="credential-value">
                                <span>admin123</span>
                                <button 
                                    onClick={() => copyToClipboard('admin123', 'password')}
                                    className="copy-btn"
                                >
                                    {copiedField === 'password' ? '✓' : '📋'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Background animated elements */}
            <div className="bg-animated-elements">
                <div className="bg-blob-1"></div>
                <div className="bg-blob-2"></div>
            </div>

            {/* Left Section */}
            <div className="auth-left-section">
                {/* Animated images */}
                <div className={`animated-images ${isLoggedIn ? 'slide-out-top' : 'slide-in-top'}`}>
                    {/* Image 1 - Document */}
                    <div className="animated-image-box doc-box">
                        <svg className="image-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>

                    {/* Image 2 - Calculator */}
                    <div className="animated-image-box calc-box">
                        <svg className="image-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-6 3v-3m-6-4h18a2 2 0 012 2v12a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z" />
                        </svg>
                    </div>

                    {/* Image 3 - Wallet/Payment */}
                    <div className="animated-image-box wallet-box">
                        <svg className="image-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                {/* Animated sliding div behind text */}
                <div className={`animated-sliding-div ${isLoggedIn ? 'slide-out-right' : 'slide-left-right'}`}></div>

                {/* Invoice Generator Text with typing effect */}
                <h1 className="invoice-generator-text">
                    {displayedText}
                    {displayedText.length < fullText.length && !isLoggedIn && (
                        <span className="typing-cursor">|</span>
                    )}
                </h1>
                <p className="left-section-description">
                    Create professional invoices in seconds. Streamline your billing workflow with our intuitive platform.
                </p>


            </div>

            {/* Form Container - Pass setIsLoggedIn to children */}
            <div className="auth-form-container">
                <div className="auth-form-card">
                    {children && typeof children === 'function'
                        ? children(setIsAnimating, setIsLoggedIn)
                        : children}
                </div>
            </div>
        </div>
    );
}