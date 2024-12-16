import React, { useState } from "react";
import axios from "axios";

const AnalyzeImage = () => {
  const [image, setImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!image) {
      setError("Please select an image before analyzing.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysisResult("");

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:5000/analyze", formData);
      setAnalysisResult(response.data.message);
    } catch (err) {
      console.error("Error analyzing image:", err);
      if (err.response && err.response.data) {
        setError(`Error: ${err.response.data.error}`);
      } else {
        setError("An error occurred while analyzing the image. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Analyze Image for Hidden Data</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {error && <div style={{ color: "red" }}><strong>{error}</strong></div>}
      {analysisResult && (
        <div>
          <h2>Analysis Result:</h2>
          <p>{analysisResult}</p>
        </div>
      )}
    </div>
  );
};

export default AnalyzeImage;
