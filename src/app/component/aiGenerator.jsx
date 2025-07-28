// AI Space Description Component
"use client"
import  { useState } from "react";
 export const AISpaceDescription = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result.split(",")[1]); // Get base64 string without data:image/png;base64,
      };
      reader.readAsDataURL(file);
      setDescription(""); // Clear previous description
      setError(""); // Clear previous error
    } else {
      setSelectedImage(null);
      setBase64Image("");
      setDescription("");
      setError("");
    }
  };

  const generateDescription = async () => {
    if (!base64Image) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setDescription("");
    setError("");

    try {
      let chatHistory = [];
      const prompt =
        "Describe this space in a concise and appealing way, highlighting its key features and potential use. Focus on aspects visible in the image that would attract a potential lodger. Keep it under 100 words.";
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
                  data: base64Image,
                },
              },
            ],
          },
        ],
      };

      const apiKey = ""; // Canvas will automatically provide it in runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Check if the response itself was successful (e.g., 200 OK)
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "No additional error data available." }));
        console.error(
          `API call failed: ${response.status} ${response.statusText}`,
          errorData
        );
        setError(
          `Failed to generate description: ${
            response.statusText || "Server error"
          }. Please try again.`
        );
        return;
      }

      const result = await response.json();

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const text = result.candidates[0].content.parts[0].text;
        setDescription(text);
      } else {
        setError(
          "Failed to generate description. Please try again. Unexpected API response structure."
        );
        console.error("AI response structure unexpected:", result);
      }
    } catch (err) {
      setError(
        "An error occurred while generating the description: " + err.message
      );
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-description-card">
      <h4 className="ai-description-title">
        {/* Sparkles icon as SVG */}
        <svg
          className="icon-sparkles"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2 2m-2-2l-2 2m0 0l-2 2m2-2l2-2M9 20l2-2m-2 2l-2-2m0 0l-2-2m2 2l2 2m0 0l2 2m-2-2l-2-2M17 3l2 2m-2-2l-2 2m0 0l-2 2m2-2l2-2M21 9l-2-2m2 2l-2-2m0 0l-2-2m2 2l2 2M17 21l2-2m-2 2l-2-2m0 0l-2-2m2 2l2 2"
          ></path>
        </svg>
        AI Space Description Generator
      </h4>
      <p className="ai-description-subtitle">
        Upload an image of your space and let our AI generate a compelling
        description for your listing!
      </p>

      <div className="ai-upload-area">
        <label htmlFor="image-upload" className="ai-upload-label">
          {/* UploadCloud icon as SVG */}
          <svg
            className="icon-upload-cloud"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
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
              style={{ maxWidth: "400px", maxHeight: "300px" }}
            />
            <button
              onClick={generateDescription}
              disabled={loading}
              className={`ai-generate-button ${
                loading ? "ai-generate-button-loading" : ""
              }`}
            >
              {loading ? "Generating..." : "Generate Description"}
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
          <h5 className="ai-description-output-title">
            AI-Generated Description:
          </h5>
          <p className="ai-description-output-text">{description}</p>
        </div>
      )}
    </div>
  );
};