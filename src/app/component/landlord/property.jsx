import React, { useState } from "react";
import { useContext } from "react";
import { DashboardContext } from "@/app/landlords/layout";
const AddProperty = () => {
  // A static list of images required for a complete listing
  const { user } = useContext(DashboardContext);
  if (!user || !user.id) {
    return <div>Please log in to add a property.</div>;
  }
  const requiredImages = [
    "Living Room",
    "Kitchen",
    "Bedroom",
    "Bathroom",
    "Exterior",
    "Floor Plan",
  ];

  // State for the property details, including the new 'type' and 'unit' fields
  const [property, setProperty] = useState({
    title: "",
    description: "",
    address: "",
    unit: "",
    type: "",
    rent: "",
    amenities: "",
    // Images are now stored in an object with room names as keys, each holding an array of images
    images: requiredImages.reduce((acc, room) => ({ ...acc, [room]: [] }), {}),
  });

  // State to store the AI's recommended "best" image for each room
  const [bestImages, setBestImages] = useState({});
  const [bestImageReasons, setBestImageReasons] = useState({});

  // A placeholder landlord ID for demonstration purposes
  const landlordId = user.id;

  // State for the generated image suggestions and current image info
  const [isGuiding, setIsGuiding] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' or 'error'
  const [errorMessage, setErrorMessage] = useState(null);

  // Helper function for exponential backoff on API calls
  const fetchWithBackoff = async (url, options, retries = 3, delay = 1000) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (retries > 0) {
        await new Promise((res) => setTimeout(res, delay));
        return fetchWithBackoff(url, options, retries - 1, delay * 2);
      } else {
        throw error;
      }
    }
  };

  // Function to suggest the best image from a set of images
  const suggestBestImage = async (roomType, imageDataArray) => {
    setIsGuiding(true);
    setErrorMessage(null);
    try {
      const prompt = `
        You are a real estate photography expert. Analyze the following set of images for a property's ${roomType}. 
        Evaluate them for lighting, clarity, composition, and how well they represent the space. 
        Select the single best image from this set.
        Your response should be a JSON object with two keys:
        - 'bestImageIndex': the 0-based index of the best image in the provided array.
        - 'reason': a brief explanation (one sentence) of why this image was chosen.
      `;

      const chatHistory = [
        {
          role: "user",
          parts: [
            { text: prompt },
            ...imageDataArray.map((imageData) => ({
              inlineData: {
                mimeType: "image/jpeg",
                data: imageData.split(",")[1],
              },
            })),
          ],
        },
      ];

      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              bestImageIndex: { type: "NUMBER" },
              reason: { type: "STRING" },
            },
            propertyOrdering: ["bestImageIndex", "reason"],
          },
        },
      };

      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const result = await fetchWithBackoff(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (jsonText) {
        const parsedJson = JSON.parse(jsonText);
        setBestImages((prev) => ({
          ...prev,
          [roomType]: imageDataArray[parsedJson.bestImageIndex],
        }));
        setBestImageReasons((prev) => ({
          ...prev,
          [roomType]: parsedJson.reason,
        }));
      }
    } catch (err) {
      console.error("Failed to suggest best image:", err);
      setErrorMessage("Failed to suggest the best image. Please try again.");
    } finally {
      setIsGuiding(false);
    }
  };

  // Function to generate a description using the Gemini API
  const generateDescription = async () => {
    setIsGeneratingDescription(true);
    setErrorMessage(null);

    // Use the flattened array of the best images for a focused description
    const allBestImages = Object.values(bestImages).filter(Boolean);

    // Check if there are any images to work with
    if (allBestImages.length === 0) {
      setErrorMessage(
        "Please upload at least one image before generating a description."
      );
      setIsGeneratingDescription(false);
      return;
    }

    try {
      // Prompt for the LLM to generate a description
      const prompt = `
        You are a real estate copywriter. Write a compelling, 3-4 paragraph property description based on the provided images. 
        Highlight key features visible in the photos and use a professional, inviting tone. 
        The first paragraph should be a strong introduction to the property. 
        The subsequent paragraphs should describe the different areas shown. 
        The final paragraph should include a call to action.
      `;

      // Create the chat history with the prompt and all uploaded images
      const chatHistory = [
        {
          role: "user",
          parts: [
            { text: prompt },
            ...allBestImages.map((imageData) => ({
              inlineData: {
                mimeType: "image/jpeg",
                data: imageData.split(",")[1],
              },
            })),
          ],
        },
      ];

      const payload = { contents: chatHistory };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const result = await fetchWithBackoff(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) {
        setProperty((prevProperty) => ({
          ...prevProperty,
          description: generatedText,
        }));
      } else {
        setErrorMessage("Failed to generate description. Please try again.");
      }
    } catch (err) {
      console.error("Failed to generate description:", err);
      setErrorMessage("Failed to generate description. Please try again.");
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  // Handler for removing an image from the state
  const removeImage = (roomType, index) => {
    const newImages = property.images[roomType].filter((_, i) => i !== index);
    setProperty((prevProperty) => ({
      ...prevProperty,
      images: {
        ...prevProperty.images,
        [roomType]: newImages,
      },
    }));

    // If there's more than one image left, get a new suggestion
    if (newImages.length > 1) {
      suggestBestImage(roomType, newImages);
    } else {
      // If one or zero images left, clear the suggestion
      setBestImages((prev) => {
        const newBestImages = { ...prev };
        if (newImages.length === 1) {
          newBestImages[roomType] = newImages[0];
        } else {
          delete newBestImages[roomType];
        }
        return newBestImages;
      });
      setBestImageReasons((prev) => {
        const newBestImageReasons = { ...prev };
        if (newImages.length === 1) {
          newBestImageReasons[roomType] =
            "This is the only image uploaded for this room.";
        } else {
          delete newBestImageReasons[roomType];
        }
        return newBestImageReasons;
      });
    }
  };

  // Handler for file input change for a specific room
  const handleFileChange = (e, roomType) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [...property.images[roomType]];

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result);
          setProperty((prevProperty) => ({
            ...prevProperty,
            images: {
              ...prevProperty.images,
              [roomType]: newImages,
            },
          }));
          // Call AI to suggest the best image only if there's more than one
          if (newImages.length >= 1) {
            suggestBestImage(roomType, newImages);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // General handler for text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty((prevProperty) => ({
      ...prevProperty,
      [name]: value,
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null);
    setErrorMessage(null);

    // Flatten all images into a single array for the API payload
    const allImages = Object.values(property.images).flat();

    // Create the data payload
    const postData = {
      ...property,
      images: allImages, // Send a flat array of all images
      landlordId,
    };

    try {
      // NOTE: This fetch call is for demonstration. It will not work in this environment
      // as there is no backend server running. You'll need to update this URL
      // to your actual API endpoint.
      const response = await fetchWithBackoff(
        "http://localhost:3000/properties",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (response) {
        setSubmissionStatus("success");
        console.log("Listing created successfully:", response);
        // Clear the form after success
        setProperty({
          title: "",
          description: "",
          address: "",
          unit: "",
          type: "",
          rent: "",
          amenities: "",
          images: requiredImages.reduce(
            (acc, room) => ({ ...acc, [room]: [] }),
            {}
          ),
        });
        setBestImages({});
        setBestImageReasons({});
      }
    } catch (err) {
      console.error("Failed to create listing:", err);
      setSubmissionStatus("error");
      setErrorMessage("Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine which images are still needed based on the `requiredImages` list
  const remainingImages = requiredImages.filter(
    (room) => property.images[room].length === 0
  );

  return (
    <div className="bg-gray-100 min-h-screen p-8 flex items-center justify-center font-sans">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          List a New Property
        </h1>

        {/* Form Section */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Property Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={property.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Cozy 2-bedroom apartment"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <div className="mt-1 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <textarea
                name="description"
                id="description"
                value={property.description}
                onChange={handleChange}
                rows="4"
                className="flex-grow block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Describe the property, neighborhood, and unique features."
              ></textarea>
              <button
                type="button"
                onClick={generateDescription}
                disabled={isGeneratingDescription}
                className={`py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white ${
                  isGeneratingDescription
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                }`}
              >
                {isGeneratingDescription
                  ? "Generating..."
                  : "Generate Description"}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={property.address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="123 Main St, Anytown, USA"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Property Type
              </label>
              <select
                name="type"
                id="type"
                value={property.type}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select type...</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Condo">Condo</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="unit"
                className="block text-sm font-medium text-gray-700"
              >
                Unit Number (Optional)
              </label>
              <input
                type="text"
                name="unit"
                id="unit"
                value={property.unit}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., A-101"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="rent"
              className="block text-sm font-medium text-gray-700"
            >
              Monthly Rent
            </label>
            <input
              type="number"
              name="rent"
              id="rent"
              value={property.rent}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., 1500"
            />
          </div>

          <div>
            <label
              htmlFor="amenities"
              className="block text-sm font-medium text-gray-700"
            >
              Amenities
            </label>
            <textarea
              name="amenities"
              id="amenities"
              value={property.amenities}
              onChange={handleChange}
              rows="2"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="List key amenities, separated by commas (e.g., 'washer/dryer, gym, pool')"
            ></textarea>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Upload Images
            </h2>
            {requiredImages.map((room) => (
              <div
                key={room}
                className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 border border-gray-300 rounded-md shadow-sm"
              >
                <label className="text-sm font-medium text-gray-700 sm:w-1/3">
                  {room}
                </label>
                <div className="flex-grow flex flex-col space-y-2">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>
                      Upload{" "}
                      {property.images[room].length > 0 ? "more" : "images"}
                    </span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={(e) => handleFileChange(e, room)}
                      accept="image/png, image/jpeg, image/gif"
                      multiple
                    />
                  </label>
                  {property.images[room].length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {property.images[room].map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`${room} ${index + 1}`}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(room, index)}
                            className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            aria-label={`Remove ${room} image ${index + 1}`}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Image Guidance Section */}
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-indigo-800">
              Image Upload Guide
            </h3>
            {isGuiding ? (
              <p className="text-indigo-600 mt-2">
                Analyzing images and generating suggestions...
              </p>
            ) : errorMessage ? (
              <p className="text-red-500 mt-2">{errorMessage}</p>
            ) : (
              <>
                {Object.keys(bestImages).length > 0 && (
                  <div className="mt-4 space-y-4">
                    <h4 className="text-base font-semibold text-indigo-900">
                      AI's Best Image Suggestions
                    </h4>
                    {Object.keys(bestImages).map((room) => (
                      <div key={room} className="flex items-center space-x-4">
                        <img
                          src={bestImages[room]}
                          alt={`Best ${room}`}
                          className="h-20 w-20 object-cover rounded-md border-2 border-indigo-500 shadow-lg"
                        />
                        <div className="flex-grow">
                          <p className="text-sm font-medium text-indigo-700">
                            {room}:
                          </p>
                          <p className="text-xs text-indigo-900 mt-1">
                            {bestImageReasons[room]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-indigo-700 mt-2 font-bold">
                  Pro-tip: For a better listing and description, upload multiple
                  shots of each room to capture the best angles and proper
                  lighting.
                </p>
                {remainingImages.length > 0 && (
                  <>
                    <p className="text-sm text-indigo-700 mt-2">
                      To make your listing more complete, you still need to
                      upload images for:
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-indigo-900">
                      {remainingImages.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </>
                )}
                {Object.values(property.images).flat().length === 0 && (
                  <p className="text-sm text-indigo-700 mt-2">
                    Upload your first image to get started.
                  </p>
                )}
              </>
            )}
          </div>

          {submissionStatus === "success" && (
            <div className="mt-4 p-3 rounded-md bg-green-50 text-green-700">
              Listing created successfully!
            </div>
          )}
          {submissionStatus === "error" && (
            <div className="mt-4 p-3 rounded-md bg-red-50 text-red-700">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
          >
            {isSubmitting ? "Creating Listing..." : "Create Listing"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AddProperty;
