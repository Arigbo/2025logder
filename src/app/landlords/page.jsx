"use client"
import React, { useState, useEffect, useRef } from 'react';

// --- Utility Functions for Local Storage (Simulated API) ---
const LOCAL_STORAGE_KEY = 'landlordProperties';

const getPropertiesFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading from localStorage:", e);
    return [];
  }
};

const savePropertiesToLocalStorage = (properties) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(properties));
  } catch (e) {
    console.error("Error writing to localStorage:", e);
  }
};

// --- Message Box Component (for notifications) ---
function MessageBox({ message, type }) {
  if (!message) return null;
  return (
    <div className={`message-box ${type}`}>
      {message}
    </div>
  );
}

// --- Property Form Modal Component (Add/Edit) ---
function PropertyFormModal({ isOpen, onClose, onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState(() => ({
    // Safely access properties from initialData, providing defaults
    name: initialData?.name || '',
    location: initialData?.location || '',
    price: initialData?.price !== undefined ? String(initialData.price) : '', // Ensure it's a string for input
    bedrooms: initialData?.bedrooms !== undefined ? String(initialData.bedrooms) : '', // Ensure it's a string for input
    bathrooms: initialData?.bathrooms !== undefined ? String(initialData.bathrooms) : '', // Ensure it's a string for input
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    amenities: Array.isArray(initialData?.amenities) ? initialData.amenities.join(', ') : (initialData?.amenities || ''), // Ensure string
    contact: initialData?.contact || '',
    phone: initialData?.phone || '',
  }));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Reset form data when modal opens or initialData changes
    if (isOpen) {
      setFormData({
        // Safely access properties from initialData, providing defaults
        name: initialData?.name || '',
        location: initialData?.location || '',
        price: initialData?.price !== undefined ? String(initialData.price) : '',
        bedrooms: initialData?.bedrooms !== undefined ? String(initialData.bedrooms) : '',
        bathrooms: initialData?.bathrooms !== undefined ? String(initialData.bathrooms) : '',
        description: initialData?.description || '',
        imageUrl: initialData?.imageUrl || '',
        amenities: Array.isArray(initialData?.amenities) ? initialData.amenities.join(', ') : (initialData?.amenities || ''),
        contact: initialData?.contact || '',
        phone: initialData?.phone || '',
      });
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Property name is required.';
    if (!formData.location.trim()) newErrors.location = 'Location is required.';
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required.';
    }
    if (formData.bedrooms === '' || isNaN(parseInt(formData.bedrooms)) || parseInt(formData.bedrooms) < 0) {
      newErrors.bedrooms = 'Valid number of bedrooms is required.';
    }
    if (formData.bathrooms === '' || isNaN(parseInt(formData.bathrooms)) || parseInt(formData.bathrooms) < 0) {
      newErrors.bathrooms = 'Valid number of bathrooms is required.';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required.';
    if (!formData.contact.trim()) newErrors.contact = 'Contact email is required.';
    if (!/^\S+@\S+\.\S+$/.test(formData.contact)) newErrors.contact = 'Valid email is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const processedData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a !== ''),
      };
      onSubmit(processedData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay show">
      <div className="modal-content">
        <h3 className="modal-title">{initialData?.id ? 'Edit Property' : 'Add New Property'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Property Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <p className="error-text-small">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} />
            {errors.location && <p className="error-text-small">{errors.location}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="price">Price (₦/month)</label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} />
            {errors.price && <p className="error-text-small">{errors.price}</p>}
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="bedrooms">Bedrooms</label>
              <input type="number" id="bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} />
              {errors.bedrooms && <p className="error-text-small">{errors.bedrooms}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="bathrooms">Bathrooms</label>
              <input type="number" id="bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleChange} />
              {errors.bathrooms && <p className="error-text-small">{errors.bathrooms}</p>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange}></textarea>
            {errors.description && <p className="error-text-small">{errors.description}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="imageUrl">Image URL</label>
            <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
            {errors.imageUrl && <p className="error-text-small">{errors.imageUrl}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="amenities">Amenities (comma-separated)</label>
            <input type="text" id="amenities" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="e.g., Wi-Fi, Furnished, Gym" />
          </div>
          <div className="form-group">
            <label htmlFor="contact">Contact Email</label>
            <input type="email" id="contact" name="contact" value={formData.contact} onChange={handleChange} />
            {errors.contact && <p className="error-text-small">{errors.contact}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
            {errors.phone && <p className="error-text-small">{errors.phone}</p>}
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="button-secondary">Cancel</button>
            <button type="submit" className="button-primary">{initialData?.id ? 'Save Changes' : 'Add Property'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Confirm Delete Modal Component ---
function ConfirmDeleteModal({ isOpen, onClose, onConfirm, propertyName }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay show">
      <div className="modal-content">
        <h3 className="modal-title">Confirm Deletion</h3>
        <p>Are you sure you want to delete the property "<strong>{propertyName}</strong>"? This action cannot be undone.</p>
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="button-secondary">Cancel</button>
          <button type="button" onClick={onConfirm} className="button-danger">Delete</button>
        </div>
      </div>
    </div>
  );
}

// --- Property Card Component (for rendering properties) ---
const PropertyCard = ({ property, onEdit, onDelete }) => {
  if (!property) return null; // Handle cases where property might be undefined

  return (
    <div className="apartment-card">
      <img
        src={property.imageUrl}
        alt={property.name}
        className="apartment-card-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/400x250/CCCCCC/666666?text=Image+Not+Found';
        }}
      />
      <div className="apartment-card-content">
        <h2 className="apartment-card-title">{property.name}</h2>
        <p className="apartment-card-location">{property.location}</p>
        <div className="apartment-card-details">
          <span className="apartment-card-price">₦{property.price.toLocaleString()}/month</span>
          <span className="apartment-card-specs">
            {property.bedrooms} Bed{property.bedrooms !== 1 ? 's' : ''} |{' '}
            {property.bathrooms > 0 ? `${property.bathrooms} Bath` : 'Shared Bath'}
          </span>
        </div>
        <div className="apartment-card-amenities">
          {property.amenities && property.amenities.length > 0 ? (
            property.amenities.map((amenity, idx) => (
              <span key={idx} className="amenity-tag">{amenity}</span>
            ))
          ) : (
            <span className="amenity-tag">No amenities listed</span>
          )}
        </div>
      </div>
      <div className="property-card-actions">
        <button onClick={() => onEdit(property)} className="button-edit">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          Edit
        </button>
        <button onClick={() => onDelete(property.id, property.name)} className="button-delete">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
};


// --- Landlord Dashboard Main Component ---
export default function LandlordDashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null); // Used for editing

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState({ id: null, name: '' });

  // Load properties on initial mount
  useEffect(() => {
    setLoading(true);
    const storedProperties = getPropertiesFromLocalStorage();
    setProperties(storedProperties);
    setLoading(false);
  }, []);

  // Show message function
  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  // --- CRUD Operations ---
  const handleAddProperty = (newProperty) => {
    const propertyWithId = { ...newProperty, id: Date.now().toString() }; // Simple ID generation
    const updatedProperties = [...properties, propertyWithId];
    setProperties(updatedProperties);
    savePropertiesToLocalStorage(updatedProperties);
    setIsAddEditModalOpen(false);
    showMessage('Property added successfully!', 'success');
  };

  const handleEditProperty = (updatedProperty) => {
    const updatedProperties = properties.map(prop =>
      prop.id === updatedProperty.id ? updatedProperty : prop
    );
    setProperties(updatedProperties);
    savePropertiesToLocalStorage(updatedProperties);
    setIsAddEditModalOpen(false);
    setCurrentProperty(null);
    showMessage('Property updated successfully!', 'success');
  };

  const handleDeleteProperty = () => {
    const updatedProperties = properties.filter(prop => prop.id !== propertyToDelete.id);
    setProperties(updatedProperties);
    savePropertiesToLocalStorage(updatedProperties);
    setIsConfirmDeleteModalOpen(false);
    setPropertyToDelete({ id: null, name: '' });
    showMessage('Property deleted successfully!', 'success');
  };

  // --- Modal Handlers ---
  const openAddModal = () => {
    setCurrentProperty(null);
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (property) => {
    setCurrentProperty(property);
    setIsAddEditModalOpen(true);
  };

  const openConfirmDeleteModal = (id, name) => {
    setPropertyToDelete({ id, name });
    setIsConfirmDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsAddEditModalOpen(false);
    setIsConfirmDeleteModalOpen(false);
    setCurrentProperty(null);
    setPropertyToDelete({ id: null, name: '' });
  };

  // --- Dashboard Metrics ---
  const totalProperties = properties.length;
  const averagePrice = totalProperties > 0
    ? (properties.reduce((sum, prop) => sum + prop.price, 0) / totalProperties).toLocaleString(undefined, { maximumFractionDigits: 0 })
    : 'N/A';
  const sharedBathroomProperties = properties.filter(prop => prop.bathrooms === 0).length;

  return (
    <>
      <style>
        {`
        /* Base styles */
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            background-color: #f0f2f5;
            line-height: 1.6;
            color: #333;
        }

        .dashboard-container {
            padding: 20px; /* Adjusted padding for smaller screens */
            max-width: 1280px;
            margin: 20px auto; /* Adjusted margin for smaller screens */
            background-color: #ffffff;
            min-height: calc(100vh - 40px); /* Adjusted min-height */
            border-radius: 16px;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
            display: flex;
            flex-direction: column;
            gap: 20px; /* Adjusted gap */
        }

        @media (min-width: 768px) { /* Medium screens */
            .dashboard-container {
                padding: 30px;
                margin: 30px auto;
                gap: 30px;
            }
        }

        .header {
            display: flex;
            flex-direction: column; /* Stack on small screens */
            align-items: flex-start; /* Align items to start on small screens */
            gap: 15px; /* Gap between title and button on small screens */
            padding-bottom: 15px; /* Adjusted padding */
            border-bottom: 1px solid #e0e0e0;
        }

        @media (min-width: 768px) { /* Medium screens */
            .header {
                flex-direction: row; /* Row on larger screens */
                justify-content: space-between;
                align-items: center;
                padding-bottom: 20px;
            }
        }

        .dashboard-title {
            font-size: 2rem; /* Adjusted font size for smaller screens */
            font-weight: 800;
            color: #2c3e50;
            text-align: left;
            flex-grow: 1;
        }

        @media (min-width: 768px) { /* Medium screens */
            .dashboard-title {
                font-size: 2.8rem;
            }
        }

        .button-primary {
            background-color: #6c5ce7; /* Vibrant purple */
            color: white;
            padding: 10px 20px; /* Adjusted padding */
            border: none;
            border-radius: 10px;
            font-size: 0.9rem; /* Adjusted font size */
            font-weight: 700;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 4px 10px rgba(108, 92, 231, 0.3);
            display: flex; /* For icon alignment */
            align-items: center;
            gap: 6px; /* Adjusted gap */
        }
        .button-primary:hover {
            background-color: #5a4acb;
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(108, 92, 231, 0.4);
        }

        @media (min-width: 768px) { /* Medium screens */
            .button-primary {
                padding: 12px 25px;
                font-size: 1rem;
                gap: 8px;
            }
        }

        .button-secondary {
            background-color: #e9ecef;
            color: #555;
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            font-size: 0.9rem;
            font-weight: 700;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .button-secondary:hover {
            background-color: #dee2e6;
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .button-danger {
            background-color: #dc3545;
            color: white;
            padding: 8px 15px; /* Adjusted padding */
            border: none;
            border-radius: 8px;
            font-size: 0.85rem; /* Adjusted font size */
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
        }
        .button-danger:hover {
            background-color: #c82333;
            transform: translateY(-1px);
        }

        .button-edit, .button-delete {
            padding: 8px 15px;
            border: none;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease;
            display: flex; /* For icon alignment */
            align-items: center;
            gap: 5px; /* Space between icon and text */
        }

        .button-edit {
            background-color: #007bff;
            color: white;
        }
        .button-edit:hover {
            background-color: #0056b3;
        }

        .button-delete {
            background-color: #dc3545;
            color: white;
        }
        .button-delete:hover {
            background-color: #c82333;
        }

        /* Dashboard Overview */
        .dashboard-overview {
            display: grid;
            grid-template-columns: 1fr; /* Stack on small screens */
            gap: 20px; /* Adjusted gap */
            margin-bottom: 20px; /* Adjusted margin */
        }

        @media (min-width: 640px) { /* Small screens */
            .dashboard-overview {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Two columns on small screens */
            }
        }

        @media (min-width: 768px) { /* Medium screens */
            .dashboard-overview {
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Three columns on medium screens */
                gap: 25px;
                margin-bottom: 30px;
            }
        }

        .metric-card {
            background-color: #f8faff;
            padding: 20px; /* Adjusted padding */
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            text-align: center;
            border: 1px solid #e0e0e0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .metric-card h3 {
            font-size: 1.1rem; /* Adjusted font size */
            color: #4a69bd;
            margin-bottom: 8px; /* Adjusted margin */
            font-weight: 600;
        }

        .metric-card p {
            font-size: 2rem; /* Adjusted font size */
            font-weight: 800;
            color: #2c3e50;
        }

        @media (min-width: 768px) { /* Medium screens */
            .metric-card h3 {
                font-size: 1.2rem;
                margin-bottom: 10px;
            }
            .metric-card p {
                font-size: 2.5rem;
            }
        }

        /* Properties Section */
        .properties-section {
            background-color: #ffffff;
            padding: 20px; /* Adjusted padding */
            border-radius: 16px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06);
            display: flex;
            flex-direction: column;
            gap: 20px; /* Adjusted gap */
        }

        @media (min-width: 768px) { /* Medium screens */
            .properties-section {
                padding: 30px;
                gap: 25px;
            }
        }

        .section-title {
            font-size: 1.8rem; /* Adjusted font size */
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 10px; /* Adjusted margin */
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 8px; /* Adjusted padding */
        }

        @media (min-width: 768px) { /* Medium screens */
            .section-title {
                font-size: 2rem;
                margin-bottom: 15px;
                padding-bottom: 10px;
            }
        }

        .property-grid {
            display: grid;
            grid-template-columns: 1fr; /* Single column on small screens */
            gap: 20px; /* Adjusted gap */
        }

        @media (min-width: 640px) { /* Small screens */
            .property-grid {
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* Two columns on small screens */
            }
        }

        @media (min-width: 1024px) { /* Large screens */
            .property-grid {
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Three columns on large screens */
                gap: 25px;
            }
        }

        .apartment-card {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            display: flex;
            flex-direction: column;
            height: 100%;
            border: 1px solid #f0f0f0;
        }

        .apartment-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        .apartment-card-image {
            width: 100%;
            height: 180px; /* Adjusted image height for responsiveness */
            object-fit: cover;
            border-bottom: 1px solid #f0f0f0;
        }

        @media (min-width: 768px) { /* Medium screens */
            .apartment-card-image {
                height: 200px;
            }
        }

        .apartment-card-content {
            padding: 15px; /* Adjusted padding */
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        @media (min-width: 768px) { /* Medium screens */
            .apartment-card-content {
                padding: 20px;
            }
        }

        .apartment-card-title {
            font-size: 1.3rem; /* Adjusted font size */
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 6px; /* Adjusted margin */
        }

        @media (min-width: 768px) { /* Medium screens */
            .apartment-card-title {
                font-size: 1.4rem;
                margin-bottom: 8px;
            }
        }

        .apartment-card-location {
            font-size: 0.9rem; /* Adjusted font size */
            color: #666;
            margin-bottom: 10px; /* Adjusted margin */
        }

        @media (min-width: 768px) { /* Medium screens */
            .apartment-card-location {
                font-size: 0.95rem;
                margin-bottom: 12px;
            }
        }

        .apartment-card-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px; /* Adjusted margin */
            flex-wrap: wrap;
        }

        @media (min-width: 768px) { /* Medium screens */
            .apartment-card-details {
                margin-bottom: 15px;
            }
        }

        .apartment-card-price {
            font-size: 1.1rem; /* Adjusted font size */
            font-weight: 800;
            color: #28a745;
        }

        @media (min-width: 768px) { /* Medium screens */
            .apartment-card-price {
                font-size: 1.25rem;
            }
        }

        .apartment-card-specs {
            font-size: 0.85rem; /* Adjusted font size */
            color: #777;
        }

        @media (min-width: 768px) { /* Medium screens */
            .apartment-card-specs {
                font-size: 0.9rem;
            }
        }

        .apartment-card-amenities {
            display: flex;
            flex-wrap: wrap;
            gap: 6px; /* Adjusted gap */
            margin-top: auto;
            padding-top: 12px; /* Adjusted padding */
            border-top: 1px solid #f0f0f0;
        }

        @media (min-width: 768px) { /* Medium screens */
            .apartment-card-amenities {
                gap: 8px;
                padding-top: 15px;
            }
        }

        .amenity-tag {
            background-color: #e6e6fa;
            color: #6a5acd;
            padding: 5px 9px; /* Adjusted padding */
            border-radius: 15px;
            font-size: 0.75rem; /* Adjusted font size */
            font-weight: 600;
            white-space: nowrap;
        }

        @media (min-width: 768px) { /* Medium screens */
            .amenity-tag {
                padding: 6px 10px;
                font-size: 0.8rem;
            }
        }

        .property-card-actions {
            display: flex;
            justify-content: space-around;
            padding: 12px 15px; /* Adjusted padding */
            background-color: #f8faff;
            border-top: 1px solid #e0e0e0;
            gap: 8px; /* Adjusted gap */
        }

        @media (min-width: 768px) { /* Medium screens */
            .property-card-actions {
                padding: 15px 20px;
                gap: 10px;
            }
        }

        .loading-text, .error-text {
            text-align: center;
            font-size: 1.1em; /* Adjusted font size */
            color: #6c757d;
            padding-top: 40px; /* Adjusted padding */
        }
        .error-text {
            color: #dc3545;
        }

        @media (min-width: 768px) { /* Medium screens */
            .loading-text, .error-text {
                font-size: 1.3em;
                padding-top: 60px;
            }
        }

        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .modal-overlay.show {
            opacity: 1;
            visibility: visible;
        }
        .modal-content {
            background-color: white;
            padding: 20px; /* Adjusted padding */
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            max-width: 90%; /* Increased max-width for small screens */
            width: 90%;
            transform: translateY(-20px);
            transition: transform 0.3s ease;
            max-height: 90vh;
            overflow-y: auto;
        }
        @media (min-width: 600px) { /* Adjust for larger modals on tablets/desktops */
            .modal-content {
                max-width: 600px;
                padding: 30px;
            }
        }
        .modal-overlay.show .modal-content {
            transform: translateY(0);
        }

        .modal-title {
            font-size: 1.8rem; /* Adjusted font size */
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 20px; /* Adjusted margin */
            text-align: center;
        }

        @media (min-width: 768px) { /* Medium screens */
            .modal-title {
                font-size: 2rem;
                margin-bottom: 25px;
            }
        }

        .form-group {
            margin-bottom: 15px; /* Adjusted margin */
        }
        .form-group label {
            display: block;
            font-size: 0.9rem; /* Adjusted font size */
            font-weight: 600;
            color: #4a69bd;
            margin-bottom: 6px; /* Adjusted margin */
        }
        .form-group input[type="text"],
        .form-group input[type="number"],
        .form-group input[type="email"],
        .form-group input[type="tel"],
        .form-group textarea {
            width: calc(100% - 20px); /* Adjusted width for padding */
            padding: 10px; /* Adjusted padding */
            border: 1px solid #c9d6e4;
            border-radius: 8px;
            font-size: 0.95rem; /* Adjusted font size */
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .form-group textarea {
            min-height: 70px; /* Adjusted min-height */
            resize: vertical;
        }
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #6c5ce7;
            box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2);
        }

        @media (min-width: 768px) { /* Medium screens */
            .form-group {
                margin-bottom: 18px;
            }
            .form-group label {
                font-size: 0.95rem;
                margin-bottom: 8px;
            }
            .form-group input[type="text"],
            .form-group input[type="number"],
            .form-group input[type="email"],
            .form-group input[type="tel"],
            .form-group textarea {
                width: calc(100% - 24px);
                padding: 12px;
                font-size: 1rem;
            }
            .form-group textarea {
                min-height: 80px;
            }
        }

        .form-group-row {
            flex-direction: column; /* Stack on small screens */
            gap: 15px;
            margin-bottom: 15px;
        }
        @media (min-width: 600px) { /* Two columns on wider modal screens */
            .form-group-row {
                flex-direction: row;
                margin-bottom: 18px;
            }
        }
        .form-group-row .form-group {
            flex: 1;
            margin-bottom: 0;
        }

        .error-text-small {
            color: #dc3545;
            font-size: 0.8rem; /* Adjusted font size */
            margin-top: 3px; /* Adjusted margin */
        }
        @media (min-width: 768px) { /* Medium screens */
            .error-text-small {
                font-size: 0.85rem;
                margin-top: 5px;
            }
        }

        .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px; /* Adjusted gap */
            margin-top: 20px; /* Adjusted margin */
        }
        @media (min-width: 768px) { /* Medium screens */
            .modal-actions {
                gap: 15px;
                margin-top: 30px;
            }
        }

        /* Message Box specific styles */
        .message-box {
            position: fixed;
            bottom: 15px; /* Adjusted position */
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px; /* Adjusted padding */
            border-radius: 8px;
            color: white;
            font-weight: 500;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
            z-index: 1001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 0.9rem; /* Adjusted font size */
        }
        .message-box.show {
            opacity: 1;
            visibility: visible;
        }
        .message-box.success {
            background-color: #28a745; /* green */
        }
        .message-box.error {
            background-color: #dc3545; /* red */
        }
        @media (min-width: 768px) { /* Medium screens */
            .message-box {
                bottom: 20px;
                padding: 12px 24px;
                font-size: 1rem;
            }
        }
        `}
      </style>

      <div className="dashboard-container">
        <div className="header">
          <h1 className="dashboard-title">Landlord Dashboard</h1>
          <button onClick={openAddModal} className="button-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="M12 5v14"/>
            </svg>
            Add New Property
          </button>
        </div>

        <div className="dashboard-overview">
          <div className="metric-card">
            <h3>Total Properties</h3>
            <p>{totalProperties}</p>
          </div>
          <div className="metric-card">
            <h3>Average Price</h3>
            <p>₦{averagePrice}</p>
          </div>
          <div className="metric-card">
            <h3>Properties with Shared Bath</h3>
            <p>{sharedBathroomProperties}</p>
          </div>
        </div>

        <div className="properties-section">
            <h2 className="section-title">Your Property Listings</h2>
            {loading ? (
            <p className="loading-text">Loading your properties...</p>
            ) : properties.length === 0 ? (
            <p className="loading-text">You have no properties listed yet. Click "Add New Property" to get started!</p>
            ) : (
            <div className="property-grid">
                {properties.map(property => (
                <PropertyCard
                    key={property.id}
                    property={property}
                    onEdit={openEditModal}
                    onDelete={openConfirmDeleteModal}
                />
                ))}
            </div>
            )}
        </div>
      </div>

      <PropertyFormModal
        isOpen={isAddEditModalOpen}
        onClose={closeModals}
        onSubmit={currentProperty ? handleEditProperty : handleAddProperty}
        initialData={currentProperty}
      />

      <ConfirmDeleteModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeModals}
        onConfirm={handleDeleteProperty}
        propertyName={propertyToDelete.name}
      />

      <MessageBox message={message} type={messageType} />
    </>
  );
}
