// pages/apartments/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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
export default function ApartmentDetailsPage() {
  const router = useRouter(); // Hook to access the router object
  const { id } = router.query; // Get the 'id' from the URL query parameters

  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to fetch apartment details when the 'id' changes (or on initial render if 'id' exists)
  useEffect(() => {
    if (id) { // Ensure id is available before fetching
      const getApartment = async () => {
        try {
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
    }
  }, [id]); // Dependency array: re-run effect if 'id' changes

  // Display loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading apartment details...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.errorText}>Error: {error}</p>
        <Link href="/discover" passHref legacyBehavior>
          <a style={styles.backLink}>&larr; Back to Discover</a>
        </Link>
      </div>
    );
  }

  // Display "Apartment not found" if data is null after loading
  if (!apartment) {
    return (
      <div style={styles.container}>
        <p style={styles.notFoundText}>Apartment not found. It might have been removed or the link is incorrect.</p>
        <Link href="/discover" passHref legacyBehavior>
          <a style={styles.backLink}>&larr; Back to Discover</a>
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Back link */}
      <Link href="/discover" passHref legacyBehavior>
        <a style={styles.backLink}>&larr; Back to Discover Page</a>
      </Link>

      <h1 style={styles.title}>{apartment.name}</h1>

      {/* Apartment Image */}
      <div style={styles.imageContainer}>
        <img
          src={apartment.imageUrl}
          alt={apartment.name}
          style={styles.detailImage}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/800x500/CCCCCC/666666?text=Image+Not+Found';
          }}
        />
      </div>

      {/* Key Details Grid */}
      <div style={styles.detailsGrid}>
        <div style={styles.detailItem}><strong>Location:</strong> {apartment.location}</div>
        <div style={styles.detailItem}><strong>Price:</strong> {apartment.price}</div>
        <div style={styles.detailItem}><strong>Bedrooms:</strong> {apartment.bedrooms}</div>
        <div style={styles.detailItem}><strong>Bathrooms:</strong> {apartment.bathrooms}</div>
      </div>

      {/* Description */}
      <h2 style={styles.subtitle}>Description</h2>
      <p style={styles.description}>{apartment.description}</p>

      {/* Amenities */}
      <h2 style={styles.subtitle}>Amenities</h2>
      <ul style={styles.amenitiesList}>
        {apartment.amenities.map((amenity, index) => (
          <li key={index} style={styles.amenityItem}>
            {/* You could add icons here using lucide-react or similar */}
            {amenity}
          </li>
        ))}
      </ul>

      {/* Contact Information */}
      <h2 style={styles.subtitle}>Contact Landlord</h2>
      <div style={styles.contactInfo}>
        <p><strong>Email:</strong> <a href={`mailto:${apartment.contact}`} style={styles.contactLink}>{apartment.contact}</a></p>
        <p><strong>Phone:</strong> <a href={`tel:${apartment.phone}`} style={styles.contactLink}>{apartment.phone}</a></p>
      </div>

      <button style={styles.inquireButton}>Inquire Now</button>
    </div>
  );
}

// --- Inline Styles (for demonstration purposes) ---
const styles = {
  container: {
    fontFamily: '"Inter", sans-serif',
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    color: '#343a40',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '25px',
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.05em',
    transition: 'color 0.2s ease',
  },
  backLinkHover: {
    color: '#0056b3',
  },
  title: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#1a202c',
    fontSize: '2.2em',
    fontWeight: '700',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '1.2em',
    color: '#6c757d',
    paddingTop: '50px',
  },
  errorText: {
    textAlign: 'center',
    fontSize: '1.2em',
    color: '#dc3545',
    paddingTop: '50px',
  },
  notFoundText: {
    textAlign: 'center',
    fontSize: '1.2em',
    color: '#ffc107',
    paddingTop: '50px',
  },
  imageContainer: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  detailImage: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '10px',
    boxShadow: '0 6px 15px rgba(0,0,0,0.12)',
    objectFit: 'cover',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // Adaptive columns
    gap: '15px',
    marginBottom: '30px',
    padding: '0 10px',
  },
  detailItem: {
    backgroundColor: '#e9ecef', // Lighter background for detail items
    padding: '15px 20px',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
    fontWeight: '500',
    color: '#495057',
  },
  subtitle: {
    marginTop: '30px',
    marginBottom: '15px',
    color: '#2d3748',
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '8px',
    fontSize: '1.8em',
    fontWeight: '600',
  },
  description: {
    lineHeight: '1.8',
    color: '#555',
    marginBottom: '30px',
    textAlign: 'justify',
  },
  amenitiesList: {
    listStyleType: 'none',
    padding: '0',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '12px',
    marginBottom: '30px',
  },
  amenityItem: {
    backgroundColor: '#e6f7ff',
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #b3e0ff',
    color: '#0056b3',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px', // Space for potential icons
  },
  contactInfo: {
    backgroundColor: '#fff3cd', // Light yellow for contact
    border: '1px solid #ffeeba',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '30px',
    color: '#856404',
  },
  contactLink: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  inquireButton: {
    display: 'block',
    width: '100%',
    padding: '15px 25px',
    backgroundColor: '#28a745', // Green for action button
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.2em',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(40,167,69,0.3)',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
  },
  inquireButtonHover: {
    backgroundColor: '#218838',
    transform: 'translateY(-2px)',
  }
};
