import React, { useState } from "react";
import axios from "axios";

const EmbedText = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const [resultImageName, setResultImageName] = useState("secret_image.png");

  const handleEmbed = async () => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("message", message);

    try {
      const response = await axios.post("http://localhost:5000/embed", formData, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(new Blob([response.data]));
      setResultImage(url);

      // Set a default file name for the downloaded image
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) {
          setResultImageName(match[1]);
        }
      }
    } catch (err) {
      console.error("Error embedding text:", err);
    }
  };

  return (
    <div className="container">
      <h1>Embed Text into Image</h1>
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
      <input
        type="text"
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleEmbed}>Embed</button>
      {resultImage && (
        <div>
          <h2>Result:</h2>
          <img src={resultImage} alt="Secret Image" style={{ maxWidth: "100%" }} />
          <a href={resultImage} download={resultImageName}>
            <button>Download Image</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default EmbedText;
