'use client'; // This directive marks the component as a Client Component in Next.js

import React, { useState, useEffect } from 'react';

// Reusable component (simplified, without framer-motion)
const Section = ({ children, className, id }) => {
    return (
        <section id={id} className={className}>
            {children}
        </section>
    );
};

// Define a reusable IconWrapper component for feature icons
const IconWrapper = ({ children }) => (
    <div className="icon-wrapper">
        {children}
    </div>
);

// Define a reusable FeatureCard component
const FeatureCard = ({ icon, title, description }) => (
    <div className="feature-card">
        <IconWrapper>{icon}</IconWrapper>
        <h4 className="feature-card-title">{title}</h4>
        <p className="feature-card-description">{description}</p>
    </div>
);

// Define a reusable StepCard component
const StepCard = ({ number, title, description }) => (
     <div className="step-card">
        <div className="step-number">{number}</div>
        <h4 className="step-title">{title}</h4>
        <p className="step-description">{description}</p>
    </div>
);

// Define a reusable TestimonialCard component
const TestimonialCard = ({ quote, name, role, avatarUrl }) => (
    <div className="testimonial-card">
        <p className="testimonial-quote">"{quote}"</p>
        <div className="testimonial-author-info">
            <img 
                src={avatarUrl} 
                alt={`${name}'s Avatar`} 
                className="testimonial-avatar"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/48x48/e2e8f0/333333?text=AV'; }}
            />
            <div>
                <p className="testimonial-author-name">{name}</p>
                <p className="testimonial-author-role">{role}</p>
            </div>
        </div>
    </div>
);

// Define a reusable PricingCard component
const PricingCard = ({ title, subtitle, price, priceDetails, features, buttonText, buttonColor, href }) => (
    <div className={`pricing-card ${buttonColor.replace('bg-', 'border-')}`}>
        <h4 className="pricing-card-title">{title}</h4>
        <p className="pricing-card-subtitle">{subtitle}</p>
        <p className="pricing-card-price">
            {price}
            {priceDetails && <span className="pricing-card-price-details">{priceDetails}</span>}
        </p>
        <ul className="pricing-features-list">
            {features.map((feature, index) => (
                <li key={index} className="pricing-feature-item">
                    {/* Check icon as SVG */}
                    <svg className="icon-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {feature}
                </li>
            ))}
        </ul>
        <a href={href} className={`pricing-card-button ${buttonColor}`}>
            {buttonText}
        </a>
    </div>
);

// AI Space Description Component
const AISpaceDescription = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [base64Image, setBase64Image] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            const reader = new FileReader();
            reader.onloadend = () => {
                setBase64Image(reader.result.split(',')[1]); // Get base64 string without data:image/png;base64,
            };
            reader.readAsDataURL(file);
            setDescription(''); // Clear previous description
            setError(''); // Clear previous error
        } else {
            setSelectedImage(null);
            setBase64Image('');
            setDescription('');
            setError('');
        }
    };

    const generateDescription = async () => {
        if (!base64Image) {
            setError("Please upload an image first.");
            return;
        }

        setLoading(true);
        setDescription('');
        setError('');

        try {
            let chatHistory = [];
            const prompt = "Describe this space in a concise and appealing way, highlighting its key features and potential use. Focus on aspects visible in the image that would attract a potential lodger. Keep it under 100 words.";
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            
            const payload = {
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: prompt },
                            {
                                inlineData: {
                                    mimeType: "image/png", // Assuming PNG, adjust if needed
                                    data: base64Image
                                }
                            }
                        ]
                    }
                ],
            };

            const apiKey = ""; // Canvas will automatically provide it in runtime
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Check if the response itself was successful (e.g., 200 OK)
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'No additional error data available.' }));
                console.error(`API call failed: ${response.status} ${response.statusText}`, errorData);
                setError(`Failed to generate description: ${response.statusText || 'Server error'}. Please try again.`);
                return;
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setDescription(text);
            } else {
                setError("Failed to generate description. Please try again. Unexpected API response structure.");
                console.error("AI response structure unexpected:", result);
            }
        } catch (err) {
            setError("An error occurred while generating the description: " + err.message);
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-description-card">
            <h4 className="ai-description-title">
                {/* Sparkles icon as SVG */}
                <svg className="icon-sparkles" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2 2m-2-2l-2 2m0 0l-2 2m2-2l2-2M9 20l2-2m-2 2l-2-2m0 0l-2-2m2 2l2 2m0 0l2 2m-2-2l-2-2M17 3l2 2m-2-2l-2 2m0 0l-2 2m2-2l2-2M21 9l-2-2m2 2l-2-2m0 0l-2-2m2 2l2 2M17 21l2-2m-2 2l-2-2m0 0l-2-2m2 2l2 2"></path></svg>
                AI Space Description Generator
            </h4>
            <p className="ai-description-subtitle">Upload an image of your space and let our AI generate a compelling description for your listing!</p>

            <div className="ai-upload-area">
                <label htmlFor="image-upload" className="ai-upload-label">
                    {/* UploadCloud icon as SVG */}
                    <svg className="icon-upload-cloud" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    Upload Image
                </label>
                <input 
                    id="image-upload" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="ai-image-upload-input" 
                />
                {selectedImage && (
                    <div className="ai-image-preview-container">
                        <img 
                            src={selectedImage} 
                            alt="Uploaded Space" 
                            className="ai-image-preview" 
                            style={{ maxWidth: '400px', maxHeight: '300px' }}
                        />
                        <button 
                            onClick={generateDescription} 
                            disabled={loading}
                            className={`ai-generate-button ${loading ? 'ai-generate-button-loading' : ''}`}
                        >
                            {loading ? 'Generating...' : 'Generate Description'}
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="ai-error-message" role="alert">
                    <strong className="ai-error-strong">Error:</strong>
                    <span className="ai-error-text"> {error}</span>
                </div>
            )}

            {description && (
                <div className="ai-description-output">
                    <h5 className="ai-description-output-title">AI-Generated Description:</h5>
                    <p className="ai-description-output-text">{description}</p>
                </div>
            )}
        </div>
    );
};


export default function Page() { // Changed from App to Page
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Updated navigation links to include Discover and Landlord pages
    const navLinks = [
        { name: 'Discover Apartments', href: '#discover-apartments' }, // New link
        { name: 'Become a Landlord', href: './landlords/' }, // New link
        { name: 'Features', href: '#features' },
        { name: 'How It Works', href: '#how-it-works' },
        { name: 'AI Description', href: '#ai-description' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Testimonials', href: '#testimonials' },
    ];

    const heroBgImage = "https://placehold.co/1920x1080/000000/FFFFFF/png?text=Modern+Living+Space+Hero";
    const howItWorksImage = "https://storage.googleapis.com/generative-ai-prod-images/images/197171e1-c003-4903-a44d-178652d87e07/0.jpeg";
    const ctaImage = "https://storage.googleapis.com/generative-ai-prod-images/images/8410219c-8509-4d6a-8b85-502a5cf38743/0.jpeg";
    const lodgerLogo = "https://storage.googleapis.com/generative-ai-prod-images/images/8a64980a-9d62-4217-a9a3-5c8e370a82f3/0.jpeg";
    const discoverSectionImage = "https://placehold.co/600x400/4c51bf/ffffff?text=Featured+Apartments"; // Placeholder for Discover section
    const landlordSectionImage = "https://placehold.co/600x400/805ad5/ffffff?text=Landlord+Dashboard"; // Placeholder for Landlord section

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                    margin: 0;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f8f8f8;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 15px;
                }
                header {
                    background-color: #fff;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    padding: 15px 0;
                    position: fixed;
                    width: 100%;
                    top: 0;
                    z-index: 1000;
                }
                header .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                header h1 {
                    font-size: 24px;
                    font-weight: bold;
                    color: #1a202c;
                    display: flex;
                    align-items: center;
                }
                header h1 img {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    margin-right: 8px;
                }
                header nav.desktop-nav {
                    display: none; /* Hidden by default, shown on md breakpoint */
                }
                header nav.desktop-nav a {
                    color: #4a5568;
                    text-decoration: none;
                    margin-left: 30px;
                    transition: color 0.3s ease;
                }
                header nav.desktop-nav a:hover {
                    color: #4c51bf;
                }
                .get-started-btn {
                    background-color: #4c51bf;
                    color: #fff;
                    padding: 10px 20px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: background-color 0.3s ease;
                }
                .get-started-btn:hover {
                    background-color: #434190;
                }
                .desktop-only {
                    display: none; /* Hidden by default, shown on md breakpoint */
                }
                .menu-toggle {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #333;
                    display: block; /* Shown on mobile */
                }
                .mobile-menu {
                    position: fixed;
                    top: 0;
                    left: -100%; /* Off-screen by default */
                    width: 100%;
                    height: 100vh;
                    background-color: #fff;
                    padding-top: 80px;
                    transition: left 0.3s ease-in-out;
                    z-index: 999;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .mobile-menu.open {
                    left: 0;
                }
                .mobile-menu nav {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }
                .mobile-menu nav a {
                    font-size: 18px;
                    color: #4a5568;
                    text-decoration: none;
                    padding: 10px 0;
                    width: 80%;
                    text-align: center;
                }
                .mobile-menu .get-started-btn {
                    margin-top: 20px;
                    width: 80%;
                }

                /* Hero Section */
                .hero-bg {
                    background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${heroBgImage}');
                    background-size: cover;
                    background-position: center;
                    color: #fff;
                    text-align: center;
                    padding: 128px 0; /* py-32 */
                    margin-top: 64px; /* pt-16 */
                }
                .hero-bg h2 {
                    font-size: 48px; /* text-4xl md:text-6xl */
                    font-weight: bold;
                    line-height: 1.2;
                    margin-bottom: 16px; /* mb-4 */
                }
                .hero-bg p {
                    font-size: 20px; /* text-lg md:text-xl */
                    color: #e2e8f0; /* text-gray-200 */
                    margin-bottom: 32px; /* mb-8 */
                    max-width: 768px; /* max-w-3xl */
                    margin-left: auto;
                    margin-right: auto;
                }
                .hero-bg .book-btn {
                    background-color: #4c51bf; /* bg-indigo-600 */
                    color: #fff;
                    padding: 16px 32px; /* px-8 py-4 */
                    border-radius: 8px; /* rounded-lg */
                    font-weight: bold;
                    font-size: 18px; /* text-lg */
                    text-decoration: none;
                    transition: background-color 0.3s ease, transform 0.3s ease;
                }
                .hero-bg .book-btn:hover {
                    background-color: #434190; /* hover:bg-indigo-700 */
                    transform: scale(1.05); /* hover:scale-105 */
                }

                /* Sections */
                section {
                    padding: 80px 0; /* py-20 */
                }
                section.bg-white {
                    background-color: #fff;
                }
                section.bg-gray-50 {
                    background-color: #f8f8f8;
                }
                .section-title {
                    text-align: center;
                    margin-bottom: 64px; /* mb-16 */
                }
                .section-title h3 {
                    font-size: 36px; /* text-3xl md:text-4xl */
                    font-weight: bold;
                    color: #1a202c; /* text-gray-900 */
                    margin-bottom: 16px; /* mt-4 */
                }
                .section-title p {
                    color: #4a5568; /* text-gray-600 */
                    max-width: 600px; /* max-w-2xl */
                    margin: 0 auto;
                }

                /* Feature Cards */
                .feature-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 48px; /* gap-12 */
                    text-align: center;
                }
                .icon-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 64px; /* h-16 */
                    width: 64px; /* w-16 */
                    border-radius: 50%; /* rounded-full */
                    background-color: #e0e7ff; /* bg-indigo-100 */
                    margin: 0 auto 16px auto; /* mx-auto mb-4 */
                }
                .icon-wrapper svg {
                    width: 32px; /* w-8 */
                    height: 32px; /* h-8 */
                    color: #4c51bf; /* text-indigo-600 */
                }
                .feature-card-title {
                    font-size: 20px; /* text-xl */
                    font-weight: 600; /* font-semibold */
                    margin-bottom: 8px; /* mb-2 */
                    color: #1a202c; /* text-gray-900 */
                }
                .feature-card-description {
                    color: #4a5568; /* text-gray-600 */
                }

                /* How It Works Section */
                .how-it-works-image {
                    width: 100%; /* w-full */
                    max-width: 900px; /* max-w-4xl */
                    margin: 0 auto 48px auto; /* mx-auto mb-12 */
                    border-radius: 8px; /* rounded-lg */
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1); /* shadow-lg */
                    height: auto;
                    display: block;
                }
                .steps-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 32px; /* gap-8 */
                }
                .step-card {
                    background-color: #fff; /* bg-white */
                    border-radius: 8px; /* rounded-lg */
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1); /* shadow-lg */
                    padding: 32px; /* p-8 */
                    text-align: center;
                    transition: transform 0.3s ease;
                }
                .step-card:hover {
                    transform: translateY(-8px); /* hover:-translate-y-2 */
                }
                .step-number {
                    font-size: 60px; /* text-5xl */
                    font-weight: bold;
                    color: #c3dafe; /* text-indigo-200 */
                    margin-bottom: 16px; /* mb-4 */
                }
                .step-title {
                    font-size: 20px; /* text-xl */
                    font-weight: 600; /* font-semibold */
                    margin-bottom: 8px; /* mb-2 */
                    color: #1a202c; /* text-gray-900 */
                }
                .step-description {
                    color: #4a5568; /* text-gray-600 */
                }

                /* AI Space Description */
                .ai-description-card {
                    background-color: #fff; /* bg-white */
                    border-radius: 8px; /* rounded-lg */
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1); /* shadow-lg */
                    padding: 32px; /* p-8 */
                    width: 100%; /* w-full */
                    max-width: 800px; /* max-w-2xl */
                    margin: 0 auto; /* mx-auto */
                }
                .ai-description-title {
                    font-size: 24px; /* text-2xl */
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 24px; /* mb-6 */
                    color: #1a202c; /* text-gray-900 */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .icon-sparkles {
                    width: 28px; /* w-7 */
                    height: 28px; /* h-7 */
                    color: #4c51bf; /* text-indigo-600 */
                    margin-right: 12px; /* mr-3 */
                }
                .ai-description-subtitle {
                    color: #4a5568; /* text-gray-600 */
                    text-align: center;
                    margin-bottom: 32px; /* mb-8 */
                }
                .ai-upload-area {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 32px; /* mb-8 */
                }
                .ai-upload-label {
                    cursor: pointer;
                    background-color: #e0e7ff; /* bg-indigo-100 */
                    color: #4c51bf; /* text-indigo-700 */
                    padding: 12px 24px; /* px-6 py-3 */
                    border-radius: 8px; /* rounded-lg */
                    font-weight: 600; /* font-semibold */
                    transition: background-color 0.3s ease;
                    display: flex;
                    align-items: center;
                }
                .ai-upload-label:hover {
                    background-color: #c3dafe; /* hover:bg-indigo-200 */
                }
                .icon-upload-cloud {
                    width: 20px; /* w-5 */
                    height: 20px; /* h-5 */
                    margin-right: 8px; /* mr-2 */
                }
                .ai-image-upload-input {
                    display: none;
                }
                .ai-image-preview-container {
                    margin-top: 24px; /* mt-6 */
                    width: 100%; /* w-full */
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .ai-image-preview {
                    max-width: 100%; /* max-w-full */
                    height: auto; /* h-auto */
                    border-radius: 8px; /* rounded-lg */
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* shadow-md */
                    border: 1px solid #e2e8f0; /* border border-gray-200 */
                }
                .ai-generate-button {
                    margin-top: 24px; /* mt-6 */
                    padding: 12px 32px; /* px-8 py-3 */
                    border-radius: 8px; /* rounded-lg */
                    font-weight: bold;
                    font-size: 18px; /* text-lg */
                    transition: transform 0.3s ease;
                    background-color: #4c51bf; /* bg-indigo-600 */
                    color: #fff;
                    border: none;
                    cursor: pointer;
                }
                .ai-generate-button:hover {
                    transform: scale(1.05); /* hover:scale-105 */
                    background-color: #434190; /* hover:bg-indigo-700 */
                }
                .ai-generate-button-loading {
                    background-color: #a0aec0; /* bg-gray-400 */
                    cursor: not-allowed;
                    transform: none;
                }
                .ai-error-message {
                    background-color: #fee2e2; /* bg-red-100 */
                    border: 1px solid #f87171; /* border border-red-400 */
                    color: #b91c1c; /* text-red-700 */
                    padding: 16px; /* px-4 py-3 */
                    border-radius: 8px; /* rounded */
                    position: relative;
                    margin-bottom: 16px; /* mb-4 */
                }
                .ai-error-strong {
                    font-weight: bold;
                }
                .ai-error-text {
                    display: inline; /* sm:inline */
                }
                .ai-description-output {
                    margin-top: 32px; /* mt-8 */
                    background-color: #f0f4f8; /* bg-gray-50 */
                    padding: 24px; /* p-6 */
                    border-radius: 8px; /* rounded-lg */
                    border: 1px solid #e2e8f0; /* border border-gray-200 */
                }
                .ai-description-output-title {
                    font-size: 20px; /* text-xl */
                    font-weight: 600; /* font-semibold */
                    margin-bottom: 12px; /* mb-3 */
                    color: #1a202c; /* text-gray-900 */
                }
                .ai-description-output-text {
                    color: #4a5568; /* text-gray-700 */
                    line-height: 1.6; /* leading-relaxed */
                }

                /* Testimonials */
                .testimonials-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 32px; /* gap-8 */
                }
                .testimonial-card {
                    background-color: #f0f4f8; /* bg-gray-100 */
                    padding: 32px; /* p-8 */
                    border-radius: 8px; /* rounded-lg */
                }
                .testimonial-quote {
                    color: #4a5568; /* text-gray-700 */
                    margin-bottom: 24px; /* mb-6 */
                }
                .testimonial-author-info {
                    display: flex;
                    align-items: center;
                }
                .testimonial-avatar {
                    width: 48px; /* w-12 */
                    height: 48px; /* h-12 */
                    border-radius: 50%; /* rounded-full */
                    margin-right: 16px; /* mr-4 */
                    background-color: #cbd5e0; /* bg-gray-300 */
                }
                .testimonial-author-name {
                    font-weight: 600; /* font-semibold */
                    color: #1a202c; /* text-gray-900 */
                }
                .testimonial-author-role {
                    font-size: 14px; /* text-sm */
                    color: #4a5568; /* text-gray-600 */
                }

                /* Pricing Cards */
                .pricing-grid {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 32px; /* gap-8 */
                }
                .pricing-card {
                    background-color: #fff; /* bg-white */
                    border-radius: 8px; /* rounded-lg */
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1); /* shadow-lg */
                    padding: 32px; /* p-8 */
                    width: 100%; /* w-full */
                    max-width: 400px; /* max-w-md */
                    border-top-width: 4px; /* border-t-4 */
                }
                .pricing-card.border-indigo-600 {
                    border-color: #4c51bf;
                }
                .pricing-card.border-purple-600 {
                    border-color: #805ad5;
                }
                .pricing-card-title {
                    font-size: 24px; /* text-2xl */
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 8px; /* mb-2 */
                    color: #1a202c; /* text-gray-900 */
                }
                .pricing-card-subtitle {
                    color: #4a5568; /* text-gray-600 */
                    text-align: center;
                    margin-bottom: 24px; /* mb-6 */
                }
                .pricing-card-price {
                    font-size: 48px; /* text-5xl */
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 24px; /* mb-6 */
                    color: #1a202c; /* text-gray-900 */
                }
                .pricing-card-price-details {
                    font-size: 18px; /* text-lg */
                    font-weight: normal;
                }
                .pricing-features-list {
                    list-style: none;
                    padding: 0;
                    margin-bottom: 32px; /* mb-8 */
                    color: #4a5568; /* text-gray-700 */
                    line-height: 1.5; /* space-y-4 implies line-height or margin */
                }
                .pricing-feature-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 16px; /* space-y-4 */
                }
                .icon-check {
                    width: 20px; /* w-5 */
                    height: 20px; /* h-5 */
                    color: #38a169; /* text-green-500 */
                    margin-right: 12px; /* mr-3 */
                }
                .pricing-card-button {
                    display: block; /* block */
                    width: 100%; /* w-full */
                    text-align: center;
                    color: #fff;
                    padding: 12px 24px; /* px-6 py-3 */
                    border-radius: 8px; /* rounded-lg */
                    font-weight: 600; /* font-semibold */
                    text-decoration: none;
                    transition: opacity 0.3s ease;
                }
                .pricing-card-button.bg-indigo-600 {
                    background-color: #4c51bf;
                }
                .pricing-card-button.bg-indigo-600:hover {
                    opacity: 0.9;
                }
                .pricing-card-button.bg-purple-600 {
                    background-color: #805ad5;
                }
                .pricing-card-button.bg-purple-600:hover {
                    opacity: 0.9;
                }

                /* CTA Section */
                .cta-section {
                    background-color: #4c51bf; /* bg-indigo-700 */
                    color: #fff;
                    text-align: center;
                    padding: 80px 0; /* py-20 */
                }
                .cta-image {
                    width: 100%; /* w-full */
                    max-width: 1000px; /* max-w-5xl */
                    margin: 0 auto 48px auto; /* mx-auto mb-12 */
                    border-radius: 8px; /* rounded-lg */
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1); /* shadow-lg */
                    height: auto;
                    display: block;
                }
                .cta-section h3 {
                    font-size: 36px; /* text-3xl md:text-4xl */
                    font-weight: bold;
                    margin-bottom: 16px; /* mb-4 */
                }
                .cta-section p {
                    color: #a7b5ed; /* text-indigo-200 */
                    margin-bottom: 32px; /* mb-8 */
                    max-width: 600px; /* max-w-2xl */
                    margin-left: auto;
                    margin-right: auto;
                }
                .cta-btn {
                    background-color: #fff;
                    color: #4c51bf; /* text-indigo-600 */
                    padding: 16px 32px; /* px-8 py-4 */
                    border-radius: 8px; /* rounded-lg */
                    font-weight: bold;
                    font-size: 18px; /* text-lg */
                    text-decoration: none;
                    transition: background-color 0.3s ease, transform 0.3s ease;
                    display: inline-block;
                }
                .cta-btn:hover {
                    background-color: #f0f4f8; /* hover:bg-gray-100 */
                    transform: scale(1.05); /* hover:scale-105 */
                }

                /* Footer */
                footer {
                    background-color: #2d3748; /* bg-gray-800 */
                    color: #fff;
                    padding: 48px 0; /* py-12 */
                }
                footer .footer-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 32px; /* gap-8 */
                }
                footer h3 {
                    font-size: 20px; /* text-xl */
                    font-weight: bold;
                    margin-bottom: 16px; /* mb-4 */
                    display: flex;
                    align-items: center;
                }
                footer h3 img {
                    width: 32px; /* w-8 */
                    height: 32px; /* h-8 */
                    border-radius: 50%; /* rounded-full */
                    margin-right: 8px; /* mr-2 */
                }
                footer p {
                    color: #a0aec0; /* text-gray-400 */
                }
                footer h4 {
                    font-weight: 600; /* font-semibold */
                    margin-bottom: 16px; /* mb-4 */
                }
                footer ul {
                    list-style: none;
                    padding: 0;
                }
                footer ul li {
                    margin-bottom: 8px; /* space-y-2 */
                }
                footer ul li a {
                    color: #a0aec0; /* text-gray-400 */
                    text-decoration: none;
                    transition: color 0.3s ease;
                }
                footer ul li a:hover {
                    color: #fff;
                }
                footer .social-links a {
                    color: #a0aec0; /* text-gray-400 */
                    text-decoration: none;
                    margin-right: 16px; /* space-x-4 */
                    transition: color 0.3s ease;
                }
                footer .social-links a:hover {
                    color: #fff;
                }
                footer .copyright {
                    margin-top: 32px; /* mt-8 */
                    border-top: 1px solid #4a5568; /* border-t border-gray-700 */
                    padding-top: 32px; /* pt-8 */
                    text-align: center;
                    color: #a0aec0; /* text-gray-400 */
                }

                /* New sections specific styling */
                .discover-section-content, .landlord-section-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 40px;
                    text-align: center;
                }
                .discover-section-content img, .landlord-section-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .discover-section-content h3, .landlord-section-content h3 {
                    font-size: 36px;
                    font-weight: bold;
                    color: #1a202c;
                }
                .discover-section-content p, .landlord-section-content p {
                    color: #4a5568;
                    max-width: 700px;
                    margin-left: auto;
                    margin-right: auto;
                }
                .discover-section-content .button, .landlord-section-content .button {
                    background-color: #4c51bf;
                    color: #fff;
                    padding: 12px 24px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: background-color 0.3s ease;
                }
                .discover-section-content .button:hover, .landlord-section-content .button:hover {
                    background-color: #434190;
                }

                /* Responsive adjustments */
                @media (min-width: 768px) {
                    header .header-content {
                        justify-content: space-between;
                    }
                    header nav.desktop-nav {
                        display: flex;
                    }
                    .desktop-only {
                        display: block;
                    }
                    .menu-toggle {
                        display: none;
                    }
                    .mobile-menu {
                        display: none !important; /* Ensure it's hidden on desktop */
                    }
                    .feature-grid, .steps-grid, .testimonials-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                    .pricing-grid {
                        flex-direction: row;
                        align-items: stretch;
                    }
                    footer .footer-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                    .discover-section-content, .landlord-section-content {
                        flex-direction: row;
                        text-align: left;
                    }
                    .discover-section-content img {
                        order: 2; /* Image on right for discover */
                    }
                    .landlord-section-content img {
                        order: 1; /* Image on left for landlord */
                    }
                    .discover-section-content .text-content, .landlord-section-content .text-content {
                        flex: 1;
                        padding: 0 20px;
                    }
                }
                @media (max-width: 767px) {
                    header nav.desktop-nav {
                        display: none;
                    }
                    .desktop-only {
                        display: none;
                    }
                    .menu-toggle {
                        display: block;
                    }
                    .hero-bg h2 {
                        font-size: 36px;
                    }
                    .hero-bg p {
                        font-size: 18px;
                    }
                }
            `}</style>

            <div className="app-container">
                <header>
                    <div className="container header-content">
                        <h1>
                            <img 
                                src={lodgerLogo} 
                                alt="Lodger Logo" 
                                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/40x40/4a5568/ffffff?text=L'; }}
                            />
                            Lodger
                        </h1>
                        <nav className="desktop-nav">
                            {navLinks.map(link => (
                                <a key={link.name} href={link.href}>{link.name}</a>
                            ))}
                        </nav>
                        <a href="#" className="get-started-btn desktop-only">Get Started</a>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="menu-toggle">
                            {/* Menu and X icons as SVGs */}
                            {isMenuOpen ? 
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> 
                                : 
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            }
                        </button>
                    </div>

                    <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                        <nav>
                            {navLinks.map(link => (
                                <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)}>{link.name}</a>
                            ))}
                             <a href="#" onClick={() => setIsMenuOpen(false)} className="get-started-btn">Get Started</a>
                        </nav>
                    </div>
                </header>

                <main className="main-content">
                    <Section className="hero-bg">
                        <div className="container">
                            <h2>Find Your Perfect Space, Effortlessly</h2>
                            <p>Discover and book rooms, apartments, and homes for short or long-term stays. Your next adventure starts here.</p>
                            <div>
                                {/* Updated CTA to lead to Discover Apartments */}
                                <a href="./discover/" className="book-btn">Explore Apartments</a>
                            </div>
                        </div>
                    </Section>

                    {/* New Discover Apartments Section */}
                    <Section id="discover-apartments" className="bg-white">
                        <div className="container">
                            <div className="section-title">
                                <h3>Find Your Next Home</h3>
                                <p>Browse our extensive collection of verified apartments, houses, and rooms. Use our powerful search to find your ideal space.</p>
                            </div>
                            <div className="discover-section-content">
                                <div className="text-content">
                                    <h3>Discover Thousands of Listings</h3>
                                    <p>From cozy studios to spacious family homes, Lodger has a diverse range of properties to suit every need and budget. Our intuitive search and filtering options make finding your perfect match simple and quick.</p>
                                    <a href="#" className="button">Start Exploring Now</a> {/* This would link to a /discover page */}
                                </div>
                                <img 
                                    src={discoverSectionImage} 
                                    alt="Featured Apartments" 
                                    className="discover-image"
                                />
                            </div>
                        </div>
                    </Section>

                    {/* New Become a Landlord Section */}
                    <Section id="become-a-landlord" className="bg-gray-50">
                        <div className="container">
                            <div className="section-title">
                                <h3>Are You a Landlord? List Your Property!</h3>
                                <p>Join our growing community of landlords and effortlessly manage your listings, bookings, and tenants.</p>
                            </div>
                            <div className="landlord-section-content">
                                <img 
                                    src={landlordSectionImage} 
                                    alt="Landlord Dashboard" 
                                    className="landlord-image"
                                />
                                <div className="text-content">
                                    <h3>Easy Listing & Management</h3>
                                    <p>With Lodger, listing your property is quick and easy. Reach a wide audience of potential lodgers, manage your calendar, and streamline your rental process all in one place. Our tools help you maximize your occupancy and minimize hassle.</p>
                                    <a href="#" className="button">Register as a Landlord</a> {/* This would link to a /landlord/register page */}
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Section id="features" className="bg-white">
                        <div className="container">
                            <div className="section-title">
                                <h3>Why Choose Lodger?</h3>
                                <p>We provide the best tools and services to make finding and managing your lodging simple and secure.</p>
                            </div>
                            <div className="feature-grid">
                                <FeatureCard icon={
                                    // Search icon as SVG
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                } title="Verified Listings" description="Every property is vetted by our team to ensure quality and safety for our users." />
                                <FeatureCard icon={
                                    // Lock icon as SVG
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                } title="Secure Payments" description="Our encrypted payment system keeps your financial details safe and sound." />
                                <FeatureCard icon={
                                    // MessageCircle icon as SVG
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                } title="24/7 Support" description="Our dedicated support team is always available to help you with any questions." />
                            </div>
                        </div>
                    </Section>

                    <Section id="how-it-works" className="bg-gray-50">
                        <div className="container">
                            <div className="section-title">
                                <h3>Get Started in 3 Easy Steps</h3>
                                <p>Finding your next place to stay has never been this simple.</p>
                            </div>
                            <img 
                                src={howItWorksImage} 
                                alt="Easy process illustration" 
                                className="how-it-works-image"
                            />
                            <div className="steps-grid">
                                <StepCard number="1" title="Search" description="Browse thousands of listings with powerful filters to find exactly what you need." />
                                <StepCard number="2" title="Book" description="Select your dates and book your chosen place instantly and securely." />
                                <StepCard number="3" title="Stay" description="Enjoy your stay! We're here if you need anything during your time there." />
                            </div>
                        </div>
                    </Section>

                    <Section id="ai-description" className="bg-white">
                        <div className="container ai-description-container">
                            <AISpaceDescription />
                        </div>
                    </Section>
                    
                    <Section id="testimonials" className="bg-white">
                        <div className="container">
                             <div className="section-title">
                                <h3 className="section-title-h3">What Our Users Say</h3>
                            </div>
                            <div className="testimonials-grid">
                                <TestimonialCard quote="Lodger made finding a temporary apartment a breeze. The process was so simple and the support was fantastic. Highly recommended!" name="Sarah J." role="Digital Nomad" avatarUrl="https://placehold.co/48x48/e2e8f0/333333?text=SJ" />
                                <TestimonialCard quote="I was skeptical at first, but the quality of the listings and the security of the platform won me over. I found the perfect place for my business trip." name="Michael B." role="Consultant" avatarUrl="https://placehold.co/48x48/e2e8f0/333333?text=MB" />
                                <TestimonialCard quote="As a student moving to a new city, Lodger was a lifesaver. I found an affordable and safe room near my university within a day." name="Emily R." role="University Student" avatarUrl="https://placehold.co/48x48/e2e8f0/333333?text=ER" />
                            </div>
                        </div>
                    </Section>

                    <Section id="pricing" className="bg-gray-50">
                        <div className="container">
                            <div className="section-title">
                                <h3>Flexible Plans for Everyone</h3>
                                <p>Whether you're a guest or a host, we have a plan that fits your needs.</p>
                            </div>
                            <div className="pricing-grid">
                                <PricingCard 
                                    title="For Guests"
                                    subtitle="Book with confidence"
                                    price="Free"
                                    features={["Browse all listings", "Secure booking", "24/7 customer support"]}
                                    buttonText="Sign Up Now"
                                    buttonColor="bg-indigo-600"
                                    href="#"
                                />
                                <PricingCard 
                                    title="For Hosts"
                                    subtitle="List your property"
                                    price="3%"
                                    priceDetails="/booking"
                                    features={["List unlimited properties", "Manage bookings easily", "Secure payment processing"]}
                                    buttonText="Become a Host"
                                    buttonColor="bg-purple-600"
                                    href="#"
                                />
                            </div>
                        </div>
                    </Section>

                    <Section className="cta-section">
                        <div className="container">
                            <img
                                src={ctaImage}
                                alt="Ready to find your next home"
                                className="cta-image"
                            />
                            <h3>Ready to Find Your Next Home?</h3>
                            <p>Join thousands of happy users who have found their perfect place with Lodger. Create your free account today.</p>
                            <div>
                                <a href="#" className="cta-btn">Get Started for Free</a>
                            </div>
                        </div>
                    </Section>
                </main>

                <footer>
                    <div className="container">
                        <div className="footer-grid">
                            <div className="footer-col-1">
                                <h3>
                                    <img 
                                        src={lodgerLogo} 
                                        alt="Lodger Logo" 
                                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/40x40/4a5568/ffffff?text=L'; }}
                                    />
                                    Lodger
                                </h3>
                                <p>Your key to flexible and comfortable living, anywhere in the world.</p>
                            </div>
                            <div>
                                <h4>Company</h4>
                                <ul>
                                    <li><a href="#">About Us</a></li>
                                    <li><a href="#">Careers</a></li>
                                    <li><a href="#">Press</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4>Support</h4>
                                <ul>
                                    <li><a href="#">Help Center</a></li>
                                    <li><a href="#">Contact Us</a></li>
                                    <li><a href="#">Terms of Service</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4>Follow Us</h4>
                                <div className="social-links">
                                    <a href="#">Facebook</a>
                                    <a href="#">Twitter</a>
                                    <a href="#">GitHub</a>
                                </div>
                            </div>
                        </div>
                        <div className="copyright">
                            <p>&copy; {new Date().getFullYear()} Lodger. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
