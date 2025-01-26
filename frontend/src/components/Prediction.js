import React, { useState } from 'react';

const Prediction = () => {
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedScript, setSelectedScript] = useState('');
  const [showError, setShowError] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  const sectors = {
    'commercial bank': ['SCB', 'NABIL'],
    'development bank': ['JBBL', 'GBBL']
  };

  const handleSectorChange = (e) => {
    setSelectedSector(e.target.value);
    setSelectedScript('');
    setShowError(false);
  };

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
        {/* Welcome Section - Center Aligned */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to Sage's Oracle</h1>
        </div>

        {/* Sector Selection without AI Analysis Button */}
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

        {/* Script Selection - Center Aligned */}
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

        {/* Predict Button & AI Analysis Button - Center Aligned */}
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

        {/* Image Display - Center Aligned */}
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
              onClick={() => setShowAIPanel(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          <div className="p-6">
            <p className="text-gray-700">
              Utilize Gemini to analyze and interpret this prediction with real-time insights and comprehensive trend analysis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prediction;