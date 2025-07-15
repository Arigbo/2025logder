"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // New hooks for App Router
import Link from 'next/link'; // Still using Next.js Link component

// --- Utility Function to Simulate API Call for Single Apartment ---
// In a real application, this would fetch data for a specific apartment from your backend.
async function fetchApartmentById(id) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Dummy apartment data (should ideally come from a database or a more robust API)
  const apartments = [
    {
      id: '1',
      name: 'Cozy Studio near University A',
      location: 'University Avenue, Block 5, Port Harcourt',
      price: '₦150,000/month',
      bedrooms: 1,
      bathrooms: 1,
      description: 'A charming studio apartment perfect for students. Features a compact kitchen, private bathroom, and ample natural light. Situated within a 10-minute walk to the main campus gates, making it ideal for daily commutes. Includes basic furniture and a quiet study corner. Internet access available.',
      imageUrl: 'https://placehold.co/800x500/E0E0E0/333333?text=Apartment+Detail+1',
      amenities: ['Furnished', 'Air Conditioning', 'Shared Laundry Room', '24/7 Security', 'High-Speed Wi-Fi'],
      contact: 'landlord@example.com',
      phone: '+234-801-234-5678'
    },
    {
      id: '2',
      name: 'Spacious 2-Bedroom near Tech Campus',
      location: 'Innovation Hub, Tech Park Drive, Port Harcourt',
      price: '₦280,000/month',
      bedrooms: 2,
      bathrooms: 2,
      description: 'Ideal for students sharing or a small family. Two large bedrooms, a modern kitchen with appliances, and two full bathrooms. Excellent connectivity to public transport with a bus stop right outside. Property features a common area for residents and ample parking space.',
      imageUrl: 'https://placehold.co/800x500/D0D0D0/333333?text=Apartment+Detail+2',
      amenities: ['Unfurnished', 'Private Balcony', 'Dedicated Parking Spot', 'Gym Access', 'Water Heater', 'Backup Generator'],
      contact: 'landlord2@example.com',
      phone: '+234-802-345-6789'
    },
    {
      id: '3',
      name: 'Modern Loft in Downtown',
      location: 'City Center, Grand Boulevard, Port Harcourt',
      price: '₦200,000/month',
      bedrooms: 1,
      bathrooms: 1,
      description: 'Stylish loft apartment with high ceilings and industrial design. Perfect for a design student or young professional. Features an open-plan living area, a mezzanine bedroom, and panoramic city views. Close to popular cafes, restaurants, and nightlife, offering a vibrant urban living experience.',
      imageUrl: 'https://placehold.co/800x500/C0C0C0/333333?text=Apartment+Detail+3',
      amenities: ['Fully Furnished', 'Dishwasher', 'Building Security', 'City View', 'Elevator Access', 'Pet-Friendly (small pets)'],
      contact: 'landlord3@example.com',
      phone: '+234-803-456-7890'
    },
    {
      id: '4',
      name: 'Affordable Room in Shared House',
      location: 'Student District, Elm Street, Port Harcourt',
      price: '₦80,000/month',
      bedrooms: 1,
      bathrooms: 0, // 0 means shared bathroom, as indicated in description
      description: 'A single room available in a shared student house. Access to communal kitchen, living room, and two shared bathrooms. Great for meeting new people and perfect for students on a budget. All utilities included in rent. Friendly housemates guaranteed.',
      imageUrl: 'https://placehold.co/800x500/B0B0B0/333333?text=Apartment+Detail+4',
      amenities: ['Shared Kitchen', 'Shared Bathroom', 'Utilities Included', 'Garden Access', 'Weekly Cleaning of Common Areas'],
      contact: 'landlord4@example.com',
      phone: '+234-804-567-8901'
    },
    {
      id: '5',
      name: 'Bright 3-Bedroom Family Home',
      location: 'Quiet Suburb, Green Valley Estates, Port Harcourt',
      price: '₦350,000/month',
      bedrooms: 3,
      bathrooms: 2,
      description: 'A spacious and bright 3-bedroom home suitable for a small family or students looking for more space. Features a private garden, ample parking, and is located in a serene, residential area. Excellent schools and recreational facilities nearby. Unfurnished, ready for your personal touch.',
      imageUrl: 'https://placehold.co/800x500/A0A0A0/333333?text=Apartment+Detail+5',
      amenities: ['Unfurnished', 'Private Garden', 'Garage', 'Family-Friendly', 'Quiet Neighborhood', 'Security Gate'],
      contact: 'landlord5@example.com',
      phone: '+234-805-678-9012'
    },
    {
      id: '6',
      name: 'Compact Studio near Arts College',
      location: 'Bohemian Quarter, Art Street, Port Harcourt',
      price: '₦120,000/month',
      bedrooms: 1,
      bathrooms: 1,
      description: 'A charming and compact studio apartment, perfect for solo artists or students attending the nearby Arts College. Features a kitchenette, private shower, and a vibrant neighborhood atmosphere. Close to galleries, cafes, and creative spaces.',
      imageUrl: 'https://placehold.co/800x500/909090/333333?text=Apartment+Detail+6',
      amenities: ['Furnished (basic)', 'Compact Kitchenette', 'Private Shower', 'Vibrant Neighborhood', 'Walkable to Campus'],
      contact: 'landlord6@example.com',
      phone: '+234-806-789-0123'
    },
  ];
  return apartments.find(apt => apt.id === id); // Find the apartment by ID
}

// --- ApartmentDetailsPage Component ---
export default function ApartmentDetailsPage() { // Export as default for Next.js page
  // These hooks are from 'next/navigation' for Next.js App Router
  const router = useRouter(); // For navigation actions (e.g., router.push)
  const pathname = usePathname(); // To get the current path (e.g., /discover/1)
  const searchParams = useSearchParams(); // To get query parameters (e.g., ?id=1)

  // Extract ID from the pathname. Assumes URL structure like /discover/[id]
  const id = pathname ? pathname.split('/').pop() : null;

  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) { // Ensure id is available before fetching
      const getApartment = async () => {
        try {
          setLoading(true); // Set loading to true before fetching
          setError(null); // Clear previous errors
          const data = await fetchApartmentById(id); // Call the simulated API function
          if (data) {
            setApartment(data); // Set apartment data if found
          } else {
            setError('Apartment not found.'); // Set error if apartment not found
          }
        } catch (err) {
          setError('Failed to load apartment details. Please check your connection.');
          console.error('Error fetching apartment details:', err);
        } finally {
          setLoading(false); // Set loading to false
        }
      };
      getApartment();
    } else {
      setLoading(false);
      setError('No apartment ID provided in the URL.');
    }
  }, [id]); // Dependency array: re-run effect if 'id' changes

  // Display loading state
  if (loading) {
    return (
      <div className="container">
        <p className="loading-text">Loading apartment details...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="container">
        <p className="error-text">Error: {error}</p>
        <Link href="/discover" passHref> {/* Link for Next.js App Router */}
          <a className="back-link">&larr; Back to Discover</a>
        </Link>
      </div>
    );
  }

  // Display "Apartment not found" if data is null after loading
  if (!apartment) {
    return (
      <div className="container">
        <p className="not-found-text">Apartment not found. It might have been removed or the link is incorrect.</p>
        <Link href="/discover" passHref> {/* Link for Next.js App Router */}
          <a className="back-link">&larr; Back to Discover</a>
        </Link>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
        /* Base styles */
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            background-color: #f3f4f6; /* Light gray background */
        }

        .container {
            padding: 20px;
            max-width: 900px;
            margin: 0 auto;
            background-color: #ffffff; /* White background */
            min-height: 100vh;
            color: #343a40;
            border-radius: 12px; /* rounded-xl */
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
        }

        .back-link {
            display: inline-block;
            margin-bottom: 24px; /* mb-6 */
            color: #2563eb; /* blue-600 */
            text-decoration: none;
            font-weight: 600; /* font-semibold */
            font-size: 1.125rem; /* text-lg */
            transition: color 0.2s ease;
        }
        .back-link:hover {
            color: #1d4ed8; /* blue-800 */
        }

        .title {
            text-align: center;
            margin-bottom: 24px; /* mb-6 */
            color: #1a202c; /* gray-900 */
            font-size: 2.25rem; /* text-3xl sm:text-4xl */
            font-weight: 700; /* font-bold */
        }

        .loading-text, .error-text, .not-found-text {
            text-align: center;
            font-size: 1.125rem; /* text-lg */
            padding-top: 48px; /* pt-12 */
        }
        .loading-text {
            color: #6b7280; /* gray-600 */
        }
        .error-text {
            color: #dc2626; /* red-600 */
        }
        .not-found-text {
            color: #fbbf24; /* yellow-600 */
        }

        .image-container {
            text-align: center;
            margin-bottom: 32px; /* mb-8 */
        }

        .detail-image {
            max-width: 100%;
            height: auto;
            border-radius: 12px; /* rounded-xl */
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
            object-fit: cover;
        }

        .details-grid {
            display: grid;
            grid-template-columns: 1fr; /* Default to single column */
            gap: 16px; /* gap-4 */
            margin-bottom: 32px; /* mb-8 */
            padding: 0 8px; /* px-2 */
        }
        @media (min-width: 640px) { /* sm breakpoint */
            .details-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        .detail-item {
            background-color: #e5e7eb; /* gray-200 */
            padding: 16px; /* p-4 */
            border-radius: 8px; /* rounded-lg */
            border: 1px solid #d1d5db; /* border-gray-300 */
            font-weight: 500; /* font-medium */
            color: #4b5563; /* gray-700 */
        }

        .subtitle {
            margin-top: 32px; /* mt-8 */
            margin-bottom: 16px; /* mb-4 */
            color: #1f2937; /* gray-800 */
            border-bottom: 2px solid #e5e7eb; /* border-b-2 border-gray-300 */
            padding-bottom: 8px; /* pb-2 */
            font-size: 1.5rem; /* text-2xl */
            font-weight: 600; /* font-semibold */
        }

        .description {
            line-height: 1.625; /* leading-relaxed */
            color: #374151; /* gray-700 */
            margin-bottom: 32px; /* mb-8 */
            text-align: justify;
        }

        .amenities-list {
            list-style-type: none;
            padding: 0;
            display: grid;
            grid-template-columns: 1fr; /* Default to single column */
            gap: 12px; /* gap-3 */
            margin-bottom: 32px; /* mb-8 */
        }
        @media (min-width: 640px) { /* sm breakpoint */
            .amenities-list {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        @media (min-width: 1024px) { /* lg breakpoint */
            .amenities-list {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        .amenity-item {
            background-color: #e0f2fe; /* blue-100 */
            padding: 12px; /* p-3 */
            border-radius: 8px; /* rounded-lg */
            border: 1px solid #bfdbfe; /* border-blue-200 */
            color: #1e40af; /* blue-800 */
            font-weight: 600; /* font-semibold */
            display: flex;
            align-items: center;
            gap: 8px; /* gap-2 */
        }

        .contact-info {
            background-color: #fffbeb; /* yellow-100 */
            border: 1px solid #fde68a; /* border-yellow-200 */
            border-radius: 8px; /* rounded-lg */
            padding: 20px; /* p-5 */
            margin-bottom: 32px; /* mb-8 */
            color: #92400e; /* yellow-800 */
        }
        .contact-info p {
            margin-bottom: 8px; /* mb-2 */
        }
        .contact-info p:last-child {
            margin-bottom: 0;
        }

        .contact-link {
            color: #2563eb; /* blue-600 */
            text-decoration: none;
            font-weight: 700; /* font-bold */
        }
        .contact-link:hover {
            text-decoration: underline;
        }

        .inquire-button {
            display: block;
            width: 100%;
            padding: 16px 24px; /* py-4 px-6 */
            background-color: #16a34a; /* green-600 */
            color: white;
            border: none;
            border-radius: 12px; /* rounded-xl */
            font-size: 1.25rem; /* text-xl */
            font-weight: 700; /* font-bold */
            cursor: pointer;
            box-shadow: 0 10px 15px -3px rgba(22, 163, 74, 0.1), 0 4px 6px -2px rgba(22, 163, 74, 0.05); /* shadow-lg */
            transition: background-color 0.2s ease, transform 0.1s ease;
        }
        .inquire-button:hover {
            background-color: #15803d; /* green-700 */
            transform: translateY(-2px); /* hover:-translate-y-0.5 */
        }
        `}
      </style>
      <div className="container"> {/* This div acts as the main wrapper for the page content */}
        {/* Back link */}
        <Link href="/discover" passHref>
          <a className="back-link">&larr; Back to Discover Page</a>
        </Link>

        <h1 className="title">{apartment.name}</h1>

        {/* Apartment Image */}
        <div className="image-container">
          <img
            src={apartment.imageUrl}
            alt={apartment.name}
            className="detail-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/800x500/CCCCCC/666666?text=Image+Not+Found';
            }}
          />
        </div>

        {/* Key Details Grid */}
        <div className="details-grid">
          <div className="detail-item"><strong>Location:</strong> {apartment.location}</div>
          <div className="detail-item"><strong>Price:</strong> {apartment.price}</div>
          <div className="detail-item"><strong>Bedrooms:</strong> {apartment.bedrooms}</div>
          <div className="detail-item"><strong>Bathrooms:</strong> {apartment.bathrooms}</div>
        </div>

        {/* Description */}
        <h2 className="subtitle">Description</h2>
        <p className="description">{apartment.description}</p>

        {/* Amenities */}
        <h2 className="subtitle">Amenities</h2>
        <ul className="amenities-list">
          {apartment.amenities.map((amenity, index) => (
            <li key={index} className="amenity-item">
              {amenity}
            </li>
          ))}
        </ul>

        {/* Contact Information */}
        <h2 className="subtitle">Contact Landlord</h2>
        <div className="contact-info">
          <p className="mb-2"><strong>Email:</strong> <a href={`mailto:${apartment.contact}`} className="contact-link">{apartment.contact}</a></p>
          <p><strong>Phone:</strong> <a href={`tel:${apartment.phone}`} className="contact-link">{apartment.phone}</a></p>
        </div>

        <button className="inquire-button">Inquire Now</button>
      </div>
    </>
  );
}
