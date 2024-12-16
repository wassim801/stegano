// src/components/ExtractText.js
import React, { useState } from "react";
import axios from "axios";

const ExtractText = () => {
  const [image, setImage] = useState(null);
  const [hiddenMessage, setHiddenMessage] = useState("");

  const handleExtract = async () => {
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:5000/extract", formData);
      setHiddenMessage(response.data.message);
    } catch (err) {
      console.error("Error extracting text:", err);
    }
  };

  return (
    <div className="container">
      <h1>Extract Hidden Text from Image</h1>
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleExtract}>Extract Text</button>
      {hiddenMessage && (
        <div>
          <h2>Hidden Message:</h2>
          <p>{hiddenMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ExtractText;
