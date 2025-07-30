"use client"; // This directive marks the component as a Client Component in Next.js
import React, { useState, useEffect } from "react";
import { AISpaceDescription } from "@/app/component/aiGenerator";
import { TestimonialCard } from "@/app/component/testimonial";
import { FeatureCard } from "@/app/component/featurescard";
import Image from "next/image";
// Define a reusable PricingCard component
// const PricingCard = ({
//   title,
//   subtitle,
//   price,
//   priceDetails,
//   features,
//   buttonText,
//   buttonColor,
//   href,
// }) => (
//   <div className={`pricing-card ${buttonColor.replace("bg-", "border-")}`}>
//     <h4 className="pricing-card-title">{title}</h4>
//     <p className="pricing-card-subtitle">{subtitle}</p>
//     <p className="pricing-card-price">
//       {price}
//       {priceDetails && (
//         <span className="pricing-card-price-details">{priceDetails}</span>
//       )}
//     </p>
//     <ul className="pricing-features-list">
//       {features.map((feature, index) => (
//         <li key={index} className="pricing-feature-item">
//           {/* Check icon as SVG */}
//           <svg
//             className="icon-check"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M5 13l4 4L19 7"
//             ></path>
//           </svg>
//           {feature}
//         </li>
//       ))}
//     </ul>
//     <a href={href} className={`pricing-card-button ${buttonColor}`}>
//       {buttonText}
//     </a>
//   </div>
// );

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  // Effect to control body overflow when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup function to reset overflow when component unmounts or isMenuOpen changes
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Effect to handle header shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        // Add shadow after scrolling 50px
        setHeaderScrolled(true);
      } else {
        setHeaderScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const features = [
    {
      icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18v-9",
      title: "Extensive Listings",
      description:
        "Browse thousands of verified apartments, rooms, and shared spaces.",
    },
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "Instant Booking",
      description:
        "Secure your desired space with a few clicks, no lengthy paperwork.",
    },
    {
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      title: "Direct Communication",
      description: "Chat directly with landlords and potential flatmates.",
    },
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.92 12c0 2.895 1.19 5.518 3.102 7.379L3 21l3.72-1.395A11.982 11.982 0 0012 22c4.418 0 8-3.582 8-8s-3.582-8-8-8z",
      title: "Secure Payments",
      description: "Process rent and deposits securely through our platform.",
    },
    {
      icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
      title: "Personalized Matches",
      description:
        "Our algorithm suggests spaces that fit your preferences and lifestyle.",
    },
    {
      icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2 2m-2-2l-2 2m0 0l-2 2m2-2l2-2M9 20l2-2m-2 2l-2-2m0 0l-2-2m2 2l2 2m0 0l2 2m-2-2l-2-2M17 3l2 2m-2-2l-2 2m0 0l-2 2m2-2l2-2M21 9l-2-2m2 2l-2-2m0 0l-2-2m2 2l2 2M17 21l2-2m-2 2l-2-2m0 0l-2-2m2 2l2 2",
      title: "AI Description Generator",
      description:
        "Landlords can use AI to generate compelling property descriptions.",
    },
  ];
  // Updated navigation links to include Discover and Landlord pages
  const navLinks = [
    { name: "Discover Apartments", href: "/discover/" }, // New link
    { name: "Become a Landlord", href: "/landlords/" }, // New link
    { name: "Features", href: "#features" },
    // Removed AI Description link
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
  ];
  const ctaImage = "@/assests/hero.png";
  const lodgerLogo = "/favicon.ico";
  const discoverSectionImage =
    "https://placehold.co/600x400/4c51bf/ffffff?text=Featured+Apartments"; // Placeholder for Discover section
  const landlordSectionImage =
    "https://placehold.co/600x400/805ad5/ffffff?text=Landlord+Dashboard"; // Placeholder for Landlord section

  return (
    <>
      <style>{`
               
                :root {
                    --primary-indigo: #5A67D8; /* Softer indigo */
                    --primary-indigo-dark: #434190;
                    --secondary-purple: #805AD5;
                    --secondary-purple-dark: #6B46C1;
                    --text-dark: #2D3748; /* Darker text for contrast */
                    --text-medium: #4A5568;
                    --text-light: #718096;
                    --bg-light: #F7FAFC; /* Lighter background */
                    --bg-white: #FFFFFF;
                    --border-color: #E2E8F0;
                    --shadow-light: 0 4px 10px rgba(0,0,0,0.05);
                    --shadow-medium: 0 8px 20px rgba(0,0,0,0.1);
                    --shadow-strong: 0 15px 35px rgba(0,0,0,0.2);
                    --border-radius-small: 8px;
                    --border-radius-medium: 12px;
                    --border-radius-large: 15px;
                }
     
                    .container{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 90%;
                    gap: 1.4rem;
                    }
                    main{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 3rem;
                    width: 100%;
                    }
                header {
                    background-color: var(--bg-white);
                    box-shadow: 0 0 0 rgba(0,0,0,0); /* Initial no shadow */
              right: 0;
              left:0;
              height: 4rem;
              display: flex;
align-items: center;
flex-direction: column;
justify-content: center;
                    position: sticky;
                    width: 100%;
                    top: 0;
                    z-index: 1000;
                    transition: box-shadow 0.3s ease-in-out; /* Smooth transition for shadow */
                }
                header.scrolled {
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1); /* Shadow when scrolled */
                }
                header .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width:95%;
                }
                header h1 img {
width:1.8rem;
height:2.5rem;
                }
                header nav.desktop-nav {
                    display: none;
                }
                header nav.desktop-nav a {
                    color: var(--text-medium);
                    text-decoration: none;
                    transition: color 0.3s ease, transform 0.2s ease;
                    font-weight: 500; /* Bolder */
                    font-size: 18px; /* Slightly larger font */;
                    margin-right:0.8rem;
                }
                header nav.desktop-nav a:hover {
                    color: var(--primary-indigo);
                    transform: translateY(-3px); /* More pronounced hover effect */
                }
                .desktop-only {
                    display: none;
                }
                .menu-toggle {
                    background: none;
                    border: none;
                    font-size: 26px; /* Larger toggle */
                    cursor: pointer;
                    color: var(--text-dark);
                    transition: background-color 0.3s ease, transform 0.2s ease;
                }
                .menu-toggle:hover {
                    background-color: var(--border-color);
                }
                // .mobile-menu-overlay {
                //     position: fixed;
                //     top: 0;
                //     left: 0;
                //     width: 100%;
                //     height: 100%;
                //     background-color: rgba(0, 0, 0, 0.85); /* Even darker, more opaque overlay */
                //     z-index: 1000;
                //     opacity: 0;
                //     visibility: hidden;
                //     transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
                // }
                // .mobile-menu-overlay.open {
                //     opacity: 1;
                //     visibility: visible;
                // }
                .mobile-menu {
                    position: fixed;
                    top: -120%;
                    bottom: 100%;
                    right: 0;
                    width: 100%;
                                  height:100vh;
                    background-color: var(--bg-white);
                    padding: 130px 30px 60px 30px; /* More padding */
                    box-sizing: border-box;
                    transition:  0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Smoother cubic-bezier transition */
                    z-index: 1001;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    overflow-y: auto;
                }
                .mobile-menu.open {
                    top: 0;
                    bottom:0;

                }
                .mobile-menu-close-btn {
                    position: absolute;
                    top: 35px; /* Adjusted position */
                    right: 35px; /* Adjusted position */
                    background: none;
                    border: none;
                    font-size: 26px; /* Even larger */
                    color: var(--text-light); /* Softer close button color */
                    cursor: pointer;
                    transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
                }
                .mobile-menu-close-btn:hover {
                    color: var(--text-dark);
                    transform: rotate(90deg); /* Rotate on hover */
                }
                .mobile-menu nav {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 35px; /* Increased gap */
                    width: 100%;
                    padding: 0;
                }
                .mobile-menu nav a {
                    font-size: 24px; /* Larger font size */
                    color: var(--text-dark);
                    text-decoration: none;
                    text-align: center;
                    transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
                    font-weight: 500; /* Bolder */
                }
                .mobile-menu nav a:hover {
                    color: var(--primary-indigo);
                    transform: translateY(-6px); /* More pronounced lift */
                }

                /* Hero Section */
                .hero-bg {
                    background-image:  url('./assests/hero.png'); /* Even darker overlay */
                    background-size: cover;
                    background-position: center;
                    color: #fff;
                    text-align: center;
                    border-bottom-left-radius: 30px; /* More rounded bottom corners */
                    border-bottom-right-radius: 30px;
                    height: 70vh;
                    width: 100%;
                        display: flex;
         align-items: center;
         justify-content: center;
              flex-direction: column;
              gap: 1.9rem;
                }
              h2{
              margin: 0;
              }
                .hero-bg h2 {
                    font-size: 64px; /* Significantly larger heading */
                    font-weight: 900; /* Black weight */
                    line-height: 1.05;
                    text-shadow: 3px 3px 6px rgba(0,0,0,0.4); /* Stronger text shadow */
                    letter-spacing: -1.5px; /* Tighter letter spacing */
                }
                .hero-bg p {
                    font-size: 24px; /* Larger paragraph */
                    color: #E2E8F0;
                
                    width: 80%; /* Wider max-width */
                    line-height: 1.5;
                }
                .hero-bg .book-btn {
                    background-color: var(--primary-indigo);
                    color: #fff;
         display: flex;
         align-items: center;
         justify-content: center;
         padding-inline: 1.5rem;
                    border-radius: 7px; /* More rounded */
                    font-weight: 500;
                    height: 3rem;
                    width:fit-content;
                    font-size: 18px; /* Larger font */
                    text-decoration: none;
                    transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.25); /* Stronger button shadow */
                    letter-spacing: 0.5px;
                }
                .hero-bg .book-btn:hover {
                    background-color: var(--primary-indigo-dark);
                    transform: translateY(-5px) scale(1.03); /* More pronounced lift and scale */
                    box-shadow: 0 12px 25px rgba(0,0,0,0.4); /* Even stronger shadow on hover */
                }

                /* Sections */
                section {
width: 90%;
display: flex;
flex-direction: column;
align-items: center;
padding-block: 3rem;
border-radius: 0.7rem;
                }
                section.bg-white {
                    background-color: var(--bg-white);
                }
                section.bg-gray-50 {
                    background-color: var(--bg-light);
                }
                .section-title {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .section-title h3 {
                    font-size: 48px; /* Larger heading */
                    font-weight: 800;
                    color: var(--text-dark);
                    line-height: 1.15;
                    letter-spacing: -1px;
                }
                .section-title p {
                    color: var(--text-light); /* Lighter text for subtitle */
             
                    font-size: 19px;
                    line-height: 1.6;
                }

                /* Discover/Landlord Sections */
                .flex-container-center-md, .flex-container-reverse-md {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.6rem;
                    width: 100%;
                }
                .responsive-image {
                    width: 100%;
                    max-width: 600px; /* Slightly larger max width for images */
                    height: auto;
                    border-radius: var(--border-radius-large); /* More rounded corners */
                    box-shadow: var(--shadow-medium); /* Consistent shadow */
                    transition: transform 0.4s ease, box-shadow 0.4s ease;
                }

                .text-content-left-md, .text-content-right-md {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                    gap: 1.5rem;
                }
                .section-sub-title {
                    font-size: 36px; /* Larger sub-title */
                    font-weight: 800;
                    color: var(--text-dark);
                    line-height: 1.2;
                    letter-spacing: -0.8px;

                }
                .section-description {
                    color: var(--text-medium);
                    font-size: 18px;
                    line-height: 1.8;
                }
                .button-indigo {
                    background-color: var(--primary-indigo);
                    color: #fff;
         display: flex;
         align-items: center;
         justify-content: center;
         padding-inline: 1.5rem;
                    border-radius: 7px; /* More rounded */
                    font-weight: 500;
                    height: 3rem;
                    width: 90%;
                    font-size: 16px; /* Larger font */
                    text-decoration: none;
                    transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
                    box-shadow: var(--shadow-light);
                }
                .button-indigo:hover {
                    background-color: var(--primary-indigo-dark);
                    transform: translateY(-3px);
                    box-shadow: 0 6px 15px rgba(0,0,0,0.2);
                }
                .button-purple {
                    background-color: var(--secondary-purple);
                    color: #fff;
                      display: flex;
         align-items: center;
         justify-content: center;
         padding-inline: 1.5rem;
                    border-radius: 7px; /* More rounded */
                    font-weight: 500;
                    height: 3rem;
                    width: 90%;
                    font-size: 16px; /* Larger font */
                    text-decoration: none;
                    transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
                    box-shadow: var(--shadow-light);
                }
                .button-purple:hover {
                    background-color: var(--secondary-purple-dark);
                    transform: translateY(-3px);
                    box-shadow: 0 6px 15px rgba(0,0,0,0.2);
                }


                /* Feature Cards */
                .feature-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 35px; /* Adjusted gap */
                    text-align: center;
                }
                .feature-card {
                    background-color: var(--bg-white);
                    border-radius: var(--border-radius-large);
                    // box-shadow: var(--shadow-medium);
                    padding: 35px; /* Adjusted padding */
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    border: 1px solid var(--border-color);
                }
                .feature-card:hover {
                    transform: translateY(-8px); /* More pronounced lift effect */
                    // box-shadow: var(--shadow-strong);
                }
                .icon-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 75px; /* Larger icon wrapper */
                    width: 75px; /* Larger icon wrapper */
                    border-radius: 50%;
                    background-color: #EBF4FF; /* Lighter blue background */
                    margin: 0 auto 25px auto; /* More margin */
                    box-shadow: 0 5px 12px rgba(0,0,0,0.1); /* Stronger icon wrapper shadow */
                }
                .icon-wrapper svg {
                    width: 40px; /* Larger icon */
                    height: 40px; /* Larger icon */
                    color: var(--primary-indigo);
                }
                .feature-card-title {
                    font-size: 24px; /* Larger title */
                    font-weight: 700;
                    margin-bottom: 12px;
                    color: var(--text-dark);
                }
                .feature-card-description {
                    color: var(--text-medium);
                    font-size: 17px;
                    line-height: 1.7;
                }

                /* AI Space Description */
                .ai-description-card {
                    background-color: var(--bg-white);
                    border-radius: var(--border-radius-large);
                    box-shadow: var(--shadow-strong);
                    padding: 45px; /* More padding */
                    width: 100%;
                    max-width: 850px; /* Wider max-width */
                    margin: 0 auto;
                    border: 1px solid var(--border-color);
                }
                .ai-description-title {
                    font-size: 32px; /* Larger title */
                    font-weight: 800;
                    text-align: center;
                    margin-bottom: 25px;
                    color: var(--text-dark);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .icon-sparkles {
                    width: 36px;
                    height: 36px;
                    color: var(--primary-indigo);
                    margin-right: 18px;
                }
                .ai-description-subtitle {
                    color: var(--text-light);
                    text-align: center;
                    margin-bottom: 40px;
                    font-size: 18px;
                }
                .ai-upload-area {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 40px;
                }
                .ai-upload-label {
                    cursor: pointer;
                    background-color: #E0E7FF;
                    color: var(--primary-indigo);
                    padding: 18px 35px; /* Larger padding */
                    border-radius: var(--border-radius-medium);
                    font-weight: 700;
                    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
                    display: flex;
                    align-items: center;
                    box-shadow: 0 5px 12px rgba(0,0,0,0.1);
                }
                .ai-upload-label:hover {
                    background-color: #C3DAFE;
                    transform: translateY(-3px);
                    box-shadow: 0 8px 15px rgba(0,0,0,0.15);
                }
                .icon-upload-cloud {
                    width: 28px;
                    height: 28px;
                    margin-right: 12px;
                }
                .ai-image-upload-input {
                    display: none;
                }
                .ai-image-preview-container {
                    margin-top: 35px;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 25px; /* Gap between image and button */
                }
                .ai-image-preview {
                    max-width: 100%;
                    height: auto;
                    border-radius: var(--border-radius-medium);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                    border: 1px solid var(--border-color);
                }
                .ai-generate-button {
                    padding: 18px 40px; /* Larger padding */
                    border-radius: var(--border-radius-medium);
                    font-weight: 700;
                    font-size: 20px;
                    transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
                    background-color: var(--primary-indigo);
                    color: #fff;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 6px 15px rgba(0,0,0,0.2);
                }
                .ai-generate-button:hover {
                    transform: translateY(-3px);
                    background-color: var(--primary-indigo-dark);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                }
                .ai-generate-button-loading {
                    background-color: #A0AEC0;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                .ai-error-message {
                    background-color: #FEE2E2;
                    border: 1px solid #F87171;
                    color: #B91C1C;
                    padding: 20px; /* More padding */
                    border-radius: var(--border-radius-small);
                    position: relative;
                    margin-bottom: 25px;
                    font-size: 17px;
                    text-align: center;
                }
                .ai-error-strong {
                    font-weight: bold;
                }
                .ai-error-text {
                    display: inline;
                }
                .ai-description-output {
                    margin-top: 45px;
                    background-color: #F0F4F8; /* Lighter background */
                    padding: 35px;
                    border-radius: var(--border-radius-medium);
                    border: 1px solid var(--border-color);
                    box-shadow: inset 0 2px 8px rgba(0,0,0,0.05); /* Stronger inner shadow */
                }
                .ai-description-output-title {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 18px;
                    color: var(--text-dark);
                }
                .ai-description-output-text {
                    color: var(--text-medium);
                    line-height: 1.9; /* Increased line height */
                    font-size: 17px;
                }

                /* Testimonials */
                .testimonials{
                width: 100%;
                }
                .testimonials-grid {
          display: flex;
          align-items: center;
                width: 100%;
                overflow: auto;
                }
                     .testimonials-grid-inner{
                         gap: 1.1rem;
display: flex;
width: fit-content;

                     }
                .testimonial-card {
                    background-color: var(--bg-white);
                    width: 20rem;
                    padding-inline: 1.5rem;
                        padding-block: 1rem;
                    border-radius: 0.3rem;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    border: 1px solid var(--border-color);
                    display: flex;
                    flex-direction: column;
                    gap: 1.2rem;
                }
                .testimonial-quote {
                    color: var(--text-dark);
                    font-size: 15px;
                    line-height: 1.7;
                    font-weight: 400;
                }
                .testimonial-author-info {
                    display: flex;
                    align-items: center;
                gap: 0.3rem;
                }
                .testimonial-avatar {
                    width: 2.5rem; /* Larger avatar */
                    height: 2.5rem; /* Larger avatar */
                    border-radius: 50%;
                    background-color: #CBD5E0;
                    border: 3px solid #EBF4FF; /* Thicker border around avatar */
                }
                .testimonial-author-name {
                    font-weight: 600;
                    color: var(--text-dark);
                    font-size: 15px;
                }
                .testimonial-author-role {
                    font-size: 12px;
                    color: var(--text-light);
                }
                /* CTA Section */
                .cta-section {
                    background-color: var(--primary-indigo);
                    color: #fff;
                    text-align: center;
                    background-image: linear-gradient(rgba(90, 103, 216, 0.9), rgba(90, 103, 216, 0.9)), url('${ctaImage}'); /* Adjusted overlay */
                    background-size: cover;
                    background-position: center;
                    border-radius: var(--border-radius-large);
                    box-shadow: var(--shadow-strong);
                         height: 55vh;
                                                       display: flex;
         align-items: center;
         justify-content: center;
  
                }
            .cta-section .container{
            
            gap: 3rem;}
                .cta-section h3 {
                    font-size: 45px; /* Larger heading */
                    font-weight: 800;
                    text-shadow: 2px 2px 5px rgba(0,0,0,0.3);
                    letter-spacing: -1px;
                }
                .cta-section p {
                    font-size: 24px; /* Larger paragraph */
                    width: 80%;
                    line-height: 1.6;
                }
                .cta-section .cta-btn {
                    background-color: #fff;
                    color: var(--primary-indigo);
                                  display: flex;
         align-items: center;
         justify-content: center;
         padding-inline: 1.5rem;
                    border-radius: 7px; /* More rounded */
                    font-weight: 500;
                    height: 3rem;
                    width: 70%;
                    font-size: 18px; /* Larger font */
                    text-decoration: none;
                    transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
                }
                .cta-section .cta-btn:hover {
                    transform: translateY(-5px) scale(1.03);
                }

                /* Footer */
                footer {
                    background-color: var(--text-dark); /* Darker footer */
                    color: #E2E8F0;
                    width: 100%;
                    height: 15rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                footer .footer-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                        justify-content: center;
                    gap: 1.5rem;
                    width: 90%;
                    height: 85%;
                }
                footer .footer-logo {
                    font-size: 24px;
                    font-weight: 600;
                    display: flex;
                    align-items: end;
                    color: var(--bg-white); /* White logo text */
                    width:100%;
                }
                footer .footer-logo img {
                    width: 1.5rem;
                    height: 2.2rem;
                }
                    .footer-links {
                    display: flex;
                    align-items: center;
                        justify-content: center;
                    gap: 1rem;
                    width: 100%;
                    }
                footer .footer-links a {
                    color: #CBD5E0; /* Lighter gray for links */
                    text-decoration: none;
                    transition: color 0.3s ease, transform 0.2s ease;
                    font-size: 14px;
                    font-weight: 400;
                }
                footer .footer-links a:hover {
                    color: var(--primary-indigo);
                    transform: translateY(-3px);
                }
                footer .social-icons {
width: 100%;
display: flex;
align-items: center;
    justify-content: center;
    gap: 1rem;
                }
                footer .social-icons a svg{
                height: 20px;
                    color: #E2E8F0;
                    transition: color 0.3s ease, transform 0.2s ease;
                }
                footer .social-icons a:hover {
                    color: var(--primary-indigo);
                    transform: translateY(-5px);
                }
                footer .copyright {
                    font-size: 12px;
                    color: #A0AEC0;
                }

                /* Responsive adjustments */
                @media (max-width: 767px) { /* Adjustments for smaller screens */
                    .hero-bg h2 {
                        font-size: 44px;
                    }
                    .hero-bg p {
                        font-size: 18px;
                    }
                    .section-title h3 {
                        font-size: 36px;
                    }
                    .section-title p {
                        font-size: 16px;
                    }
                    .section-sub-title {
                        font-size: 28px;
                    }
                    .section-description {
                        font-size: 16px;
                    }
                     
                    .cta-section h3 {
                        font-size: 36px;
                    }
                    .cta-section p {
                        font-size: 18px;
                    }
                }


                @media (min-width: 768px) { /* md breakpoint */
                    header nav.desktop-nav {
                        display: flex;
                        gap: 1rem;
                        align-items: center;
                    }
                    .menu-toggle {
                        display: none;
                    }
                    .desktop-only {
                        display: block;
                    }
                    .flex-container-center-md {
                        flex-direction: row;
                        justify-content: center;
                        align-items: end;
                        gap: 1.5rem; /* Larger gap for desktop */
                    }
                    .flex-container-reverse-md {
                        flex-direction: row-reverse; /* Reverse order */
                        justify-content: center;
                        align-items: end;
                        gap: 1.5rem; /* Larger gap for desktop */
                    }
                    .responsive-image {
                        width: 48%; /* Adjust width for side-by-side */
                    }
                    .text-content-left-md {
                        text-align: right;
                        width: 48%; /* Adjust width for side-by-side */
                    }
                    .text-content-right-md {
                        text-align: left;    
                        width: 48%; /* Adjust width for side-by-side */
                    }
                    .feature-grid {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 40px; /* Larger gap for desktop */
                    }
                    .testimonials-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                           .cta-section{
                   height: 70vh;

                        }
                      .cta-section .container{
                   width: 70%;
                   height: 70%;
                        }
                    .pricing-grid {
                        flex-direction: row;
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                    .pricing-card {
                        width: calc(33.333% - 40px); /* For 3 cards in a row with more gap */
                        margin: 20px 10px; /* Add margin around cards, slightly less horizontal */
                    }
                        footer{
     height: 27vh;      
     margin-top: 2rem;      
                        }
                    footer .footer-content {
                     display: grid;
                        grid-template-columns: 1fr 1.5fr 0.5fr;
                        grid-template-row: 1fr;
                        justify-content: space-between;
                        align-items: center;
                    }
                    footer .footer-logo {
                      width: fit-content;
                    }
                    footer .social-icons {
                       width: fit-content;
                    }


                    .footer-links {
                    width: fit-content;
                    }
                footer .footer-links a {
                    font-size: 16px;
                    font-weight: 500;
                }
  
                footer .social-icons a svg{
                height: 28px;

                }
                footer .copyright {
                    font-size: 14px;
                }
                }

                @media (min-width: 1024px) { /* lg breakpoint */
                    .testimonials-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
            `}</style>

      <header className={headerScrolled ? "scrolled" : ""}>
        <div className="header-content">
          <h1>
            <img src={lodgerLogo} alt="Lodger Logo" />
          </h1>
          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href}>
                {link.name}
              </a>
            ))}
          </nav>
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "" : "☰"}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {/* <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}></div> */}

      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <button
          className="mobile-menu-close-btn"
          onClick={() => setIsMenuOpen(false)}
        >
          ✕
        </button>
        <nav>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>

      <main>
        {/* Hero Section */}
        <section id="home" className="hero-bg">
          <h2>Find Your Perfect Space, Instantly.</h2>
          <p>
            Discover a wide range of apartments, rooms, and shared spaces
            tailored to your needs. Effortless booking, seamless living.
          </p>
          <a href="/discover/" className="book-btn">
            Book Your Space Now
          </a>
        </section>

        {/* Discover Apartments Section */}
        <section id="discover-apartments" className="bg-white">
          <div className="container">
            <div className="section-title">
              <h3>Discover Your Next Home</h3>
              <p>
                Explore a curated selection of apartments and rooms. Use our
                advanced filters to find exactly what you're looking for.
              </p>
            </div>
            <div className="flex-container-center-md">
              {" "}
              {/* Custom class for flex layout */}
              
             {/* <Image src="/@/app/assests/hero.jpg" width={240} height={400}/> */}
              <img
                src={discoverSectionImage}
                alt="Featured Apartments"
                className="responsive-image"
              />
              <div className="text-content-left-md">
                {" "}
                {/* Custom class for text alignment */}
                <h4 className="section-sub-title">
                  Your Dream Apartment Awaits
                </h4>
                <p className="section-description">
                  From cozy studios to spacious family homes, we have options
                  for every lifestyle and budget. Start browsing today!
                </p>
                <a href="/discover/" className="button-indigo">
                  View Listings
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Become a Landlord Section */}
        <section id="become-a-landlord" className="bg-gray-50">
          <div className="container">
            <div className="section-title">
              <h3>Become a Landlord with Ease</h3>
              <p>
                List your property, manage bookings, and connect with reliable
                lodgers. Our platform simplifies the entire process.
              </p>
            </div>
            <div className="flex-container-reverse-md">
              {" "}
              {/* Custom class for flex layout */}
              <img
                src={landlordSectionImage}
                alt="Landlord Dashboard"
                className="responsive-image"
              />
              <div className="text-content-right-md">
                {" "}
                {/* Custom class for text alignment */}
                <h4 className="section-sub-title">
                  Effortless Property Management
                </h4>
                <p className="section-description">
                  Gain access to powerful tools for listing, tenant screening,
                  and communication. Maximize your occupancy with minimal
                  hassle.
                </p>
                <a href="/landlords/" className="button-purple">
                  Learn More for Landlords
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white">
          <div className="container">
            <div className="section-title">
              <h3>Features Designed for You</h3>
              <p>
                Everything you need to find and secure your ideal living space,
                or manage your properties with ease.
              </p>
            </div>
            <div className="feature-grid">
              {features.map((feature) => {
                return (
                  <FeatureCard
                    icon={
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={feature.icon}
                        ></path>
                      </svg>
                    }
                    title={feature.title}
                    description={feature.description}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* AI Space Description Section - Commented out */}

        {/* <section id="ai-description" className="bg-white">
          <div className="container">
            <AISpaceDescription />
          </div>
        </section> */}

        {/* Pricing Section */}
        {/* <Section id="pricing" className="bg-white">
                    <div className="container">
                        <div className="section-title">
                            <h3>Flexible Pricing Plans</h3>
                            <p>Choose the plan that best fits your needs, whether you're a lodger or a landlord.</p>
                        </div>
                        <div className="pricing-grid">
                            <PricingCard 
                                title="Basic Lodger"
                                subtitle="Perfect for finding your first room."
                                price="$0"
                                priceDetails="/month"
                                features={[
                                    "Browse listings",
                                    "Basic search filters",
                                    "Direct messaging (limited)",
                                    "Email support"
                                ]}
                                buttonText="Get Started Free"
                                buttonColor="bg-indigo-600"
                                href="#"
                            />
                            <PricingCard 
                                title="Premium Lodger"
                                subtitle="For serious apartment hunters."
                                price="$9.99"
                                priceDetails="/month"
                                features={[
                                    "All Basic features",
                                    "Advanced search filters",
                                    "Unlimited direct messaging",
                                    "Priority support",
                                    "Early access to new listings"
                                ]}
                                buttonText="Go Premium"
                                buttonColor="bg-indigo-600"
                                href="#"
                            />
                            <PricingCard 
                                title="Landlord Pro"
                                subtitle="Manage multiple properties with ease."
                                price="$29.99"
                                priceDetails="/month"
                                features={[
                                    "List up to 5 properties",
                                    "Tenant screening tools",
                                    "Automated booking management",
                                    "Dedicated landlord support",
                                    "AI description generator"
                                ]}
                                buttonText="Become a Pro Landlord"
                                buttonColor="bg-purple-600"
                                href="#"
                            />
                        </div>
                    </div>
                </Section> */}

        {/* Testimonials Section */}
        <section id="testimonials" className="bg-gray-50">
          <div className="container">
            <div className="section-title">
              <h3>What Our Users Say</h3>
              <p>
                Hear from happy lodgers and landlords who found their perfect
                match with Lodger.
              </p>
            </div>
            <div className="testimonials-grid">
              <div className="testimonials-grid-inner">
                <TestimonialCard
                  quote="Lodger made finding my new apartment incredibly easy and stress-free. The filters were spot on!"
                  name="Alice Johnson"
                  role="Happy Lodger"
                  avatarUrl="https://placehold.co/48x48/e2e8f0/333333?text=AJ"
                />
                <TestimonialCard
                  quote="Listing my spare room on Lodger was a breeze. I found a great tenant in just a few days!"
                  name="Mark Davis"
                  role="Landlord"
                  avatarUrl="https://placehold.co/48x48/e2e8f0/333333?text=MD"
                />
                <TestimonialCard
                  quote="The direct communication feature saved me so much time. Highly recommend Lodger to everyone!"
                  name="Sarah Lee"
                  role="New Tenant"
                  avatarUrl="https://placehold.co/48x48/e2e8f0/333333?text=SL"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section id="cta-section" className="cta-section">
          <div className="container">
            <h3>Ready to find your perfect space or list your property?</h3>
            <p>
              Join the Lodger community today and experience the future of
              renting.
            </p>
            <a href="#pricing" className="cta-btn">
              Start Your Journey
            </a>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <img src={lodgerLogo} alt="Lodger Logo" />
            Lodger
          </div>
          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#">Privacy Policy</a>
          </div>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              {/* Facebook icon as SVG */}
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2.04C6.51 2.04 2 6.55 2 12.04c0 5.09 3.69 9.34 8.52 10.18V14.7h-2.5v-2.66h2.5v-1.95c0-2.48 1.5-3.85 3.73-3.85 1.05 0 1.95.08 2.21.12v2.42h-1.44c-1.14 0-1.36.54-1.36 1.33v1.78h2.7l-.46 2.66h-2.24v7.52c4.83-.84 8.52-5.09 8.52-10.18 0-5.49-4.51-10-10-10z"></path>
              </svg>
            </a>
            <a href="#" aria-label="Twitter">
              {/* Twitter icon as SVG */}
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.37-.83.49-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.51 7.6 3.68 5.14c-.36.62-.56 1.35-.56 2.13 0 1.49.75 2.81 1.91 3.56-.7-.02-1.36-.21-1.93-.53v.03c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.13.15-.28 0-.55-.03-.81-.08.55 1.71 2.14 2.95 4.03 2.98-1.48 1.16-3.35 1.85-5.38 1.85-.35 0-.69-.02-1.03-.06C3.17 20.37 5.56 21 8 21c8.49 0 13.13-7.01 13.13-13.13 0-.2-.01-.4-.02-.6.9-.65 1.68-1.47 2.3-2.4z"></path>
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              {/* Instagram icon as SVG */}
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.25.06 1.93.21 2.35.37.6.22 1.01.5 1.42.91.41.41.69.82.91 1.42.16.42.31 1.1.37 2.35.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.06 1.25-.21 1.93-.37 2.35-.22.6-.5.99-.91 1.42-.41-.41-.82-.69-1.42-.91-.42.16-1.1.31-2.35.37-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.25-.06-1.93-.21-2.35-.37-.6-.22-.99-.5-1.42-.91-.41-.41-.69-.82-.91-1.42-.16-.42-.31-1.1-.37-2.35-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.06 1.25.21 1.93.37 2.35.22-.6.5-1.01.91-1.42.41-.41.82-.69 1.42-.91.42-.16 1.1-.31 2.35-.37 1.27-.06 1.65-.07 4.85-.07zm0-2.16c-3.25 0-3.67.01-4.94.07-1.3.06-2.1.23-2.65.45-.63.26-1.17.6-1.71 1.14-.54.54-.88 1.08-1.14 1.71-.22.55-.39 1.35-.45 2.65-.06 1.27-.07 1.69-.07 4.94s.01 3.67.07 4.94c.06 1.3.23 2.1.45 2.65.26.63.6 1.17 1.14 1.71.54.54 1.08.88 1.71 1.14.55.22 1.35.39 2.65.45 1.27.06 1.69.07 4.94.07s3.67-.01 4.94-.07c1.3-.06 2.1-.23 2.65-.45.63-.26 1.17-.6 1.71-1.14-.54-.54-1.08-.88-1.14-1.71-.22-.55-.39-1.35-.45-2.65-.06-1.27-.07-1.69-.07-4.94s-.01-3.67-.07-4.94c-.06-1.3-.23-2.1-.45-2.65-.26-.63-.6-1.17-1.14-1.71-.54-.54-1.08-.88-1.14-1.71-.22-.55-.39-1.35-.45-2.65-.06-1.27-.07-1.69-.07-4.94-.07zm0 5.81a6.19 6.19 0 100 12.38 6.19 6.19 0 000-12.38zm0 10.19a4 4 0 110-8 4 4 0 010 8zm6.5-10.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
              </svg>
            </a>
          </div>
          <p className="copyright">
            &copy; {new Date().getFullYear()} Lodger. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
