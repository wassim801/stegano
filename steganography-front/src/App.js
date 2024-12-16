// src/App.js
import React from "react";
import EmbedText from "./components/EmbedText";
import ExtractText from "./components/ExtractText";
import AnalyzeImage from "./components/AnalyzeImage";

const App = () => {
  return (
    <div>
      <EmbedText />
      <ExtractText />
      <AnalyzeImage />
    </div>
  );
};

export default App;
