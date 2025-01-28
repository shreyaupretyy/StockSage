import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown'; // 1) Install by running: npm install react-markdown

const Prediction = () => {
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedScript, setSelectedScript] = useState('');
  const [showError, setShowError] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [hasRequestedAnalysis, setHasRequestedAnalysis] = useState(false);

  // Sectors and scripts for dropdown
  const sectors = {
    'Commercial Bank': ['SCB', 'NABIL'],
    'Development Bank': ['JBBL', 'GBBL']
  };

  // Handler for Gemini AI request
  const handleAskGemini = async () => {
    if (!selectedScript) return;
    
    setIsLoading(true);
    setAnalysis('');
    setHasRequestedAnalysis(true);

    try {
      // Fetch and convert image
      const imageUrl = `/images/${selectedScript}.png`;
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) throw new Error('Failed to load image');
      
      const blob = await imageResponse.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      const base64data = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
      });

      // Send analysis request to the backend
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          script: selectedScript,
          image: base64data,
          prompt: "Analyze this stock prediction chart and provide insights:" 
        })
      });

      if (!response.ok) throw new Error('Analysis failed');
      
      const data = await response.json();
      // Store the AI-generated Markdown in "analysis"
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error:', error);
      setAnalysis('Failed to load analysis. Please try again.');
    }
    setIsLoading(false);
  };

  // Handler for sector changes
  const handleSectorChange = (e) => {
    setSelectedSector(e.target.value);
    setSelectedScript('');
    setShowError(false);
  };

  // Handler for "Predict" button
  const handlePredict = () => {
    if (!selectedScript) {
      setShowError(true);
      setShowImage(false);
      setShowAIPanel(false);
    } else {
      setShowError(false);
      setShowImage(true);
      console.log('Predicting for:', selectedScript);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to Sage's Oracle</h1>
        </div>

        {/* Sector Selection */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 text-center">
                  Select Sector
                </label>
                <select
                  value={selectedSector}
                  onChange={handleSectorChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled className="text-gray-400">
                    Select a sector
                  </option>
                  {Object.keys(sectors).map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Script Selection */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 text-center">
                  Select Script
                </label>
                <select
                  value={selectedScript}
                  onChange={(e) => {
                    setSelectedScript(e.target.value);
                    setShowError(false);
                  }}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled className="text-gray-400">
                    Select a script
                  </option>
                  {sectors[selectedSector]?.map((script) => (
                    <option key={script} value={script}>
                      {script}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-6">
          <button
            className="bg-green-500 text-black font-bold px-4 py-2 rounded
              hover:bg-green-900 hover:text-white transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-green-500 border-0"
            onClick={handlePredict}
          >
            Predict
          </button>

          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            disabled={!showImage}
            className={`bg-[#1a73e8] text-white font-bold px-4 py-2 rounded
              hover:bg-[#1557b0] transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-[#1a73e8] border-0
              ${!showImage ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            AI Analysis
          </button>
        </div>

        {/* Prediction Image */}
        {showImage && selectedScript && (
          <div className="mt-6 w-full flex justify-center">
            <img
              src={`/images/${selectedScript}.png`}
              alt={`Prediction for ${selectedScript}`}
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>

      {/* AI Analysis Panel */}
      {showAIPanel && showImage && (
        <div className="fixed top-24 right-4 h-[calc(100vh-8rem)] w-96 bg-white shadow-lg rounded-lg overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">AI Analysis</h2>
            <button
              onClick={() => {
                setShowAIPanel(false);
                setHasRequestedAnalysis(false);
                setAnalysis('');
              }}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          <div className="p-6">
            {/* If user hasn't requested analysis yet */}
            {!hasRequestedAnalysis ? (
              <div className="text-center">
                <p className="text-gray-700 mb-4">
                  Get AI-powered analysis of this stock prediction with real-time insights.
                </p>
                <button
                  onClick={handleAskGemini}
                  className="bg-[#1a73e8] text-white font-bold px-6 py-2 rounded
                    hover:bg-[#1557b0] transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                >
                  Ask Gemini
                </button>
              </div>
            ) : (
              <>
                {/* If the analysis is still loading */}
                {isLoading ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Analyzing market data...</p>
                  </div>
                ) : (
                  // 2) Render the AI-generated analysis as Markdown
                  <div className="prose max-w-none text-gray-700 mb-2">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                    <button
                      onClick={handleAskGemini}
                      className="mt-4 bg-[#1a73e8] text-white font-bold px-4 py-2 rounded
                        hover:bg-[#1557b0] transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-[#1a73e8] text-sm"
                    >
                      Refresh Analysis
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Prediction;