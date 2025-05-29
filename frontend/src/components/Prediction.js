import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown'; // Ensure this is installed: npm install react-markdown
import { FaChartLine, FaRobot, FaBrain, FaChevronDown, FaTimes, FaSync } from 'react-icons/fa';


const Prediction = () => {
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedScript, setSelectedScript] = useState('');
  const [showError, setShowError] = useState(false);
  const [plotImage, setPlotImage] = useState(''); // To store the base64 image from prediction
  const [plotError, setPlotError] = useState(''); // To store error messages from prediction
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [hasRequestedAnalysis, setHasRequestedAnalysis] = useState(false);

  // Sectors and scripts for dropdown
  const sectors = {
    'Commercial Bank': ['SCB', 'NABIL'],
    'Development Bank': ['JBBL'],
    'Hydropower': ['API'],
    'Others': ['NTC']
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
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          script: selectedScript,
          image: base64data,
          prompt: 'Analyze this stock prediction chart and provide insights:'
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
    setPlotImage('');
    setPlotError('');
  };

  // Handler for "Generate Prediction" button
  const handlePredict = async () => {
    if (!selectedScript) {
      setShowError(true);
      setPlotImage('');
      setPlotError('');
    } else {
      setShowError(false);

      try {
        setIsLoading(true);
        setPlotImage('');
        setPlotError('');

        const response = await fetch(`http://localhost:5000/api/predict/${selectedScript}`);
        const data = await response.json();

        if (data.success) {
          // Set the plot image using base64 data
          setPlotImage(`data:image/png;base64,${data.graph}`);
        } else {
          // Display error message
          setPlotError(data.error || 'Prediction failed. Please try again.');
        }
      } catch (error) {
        console.error('Prediction Error:', error);
        setPlotError('An unexpected error occurred. Please try again.');
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy/5 to-teal/5 py-12 px-6 relative z-0">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-navy mb-4 font-['Inter']">
            Sage's Oracle
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Harness the power of AI for precise market predictions and insights
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          {/* Sector Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-navy text-lg font-semibold mb-4 flex items-center">
              <FaChartLine className="mr-2 text-teal" />
              Select Sector
            </h3>
            <div className="relative">
              <select
                value={selectedSector}
                onChange={handleSectorChange}
                className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-navy
                         appearance-none focus:ring-2 focus:ring-teal/20 focus:border-teal 
                         transition-all pr-10"
              >
                <option value="" disabled>Choose a sector</option>
                {Object.keys(sectors).map((sector) => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <FaChevronDown className="w-4 h-4 text-navy" />
              </div>
            </div>
          </div>

          {/* Script Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-navy text-lg font-semibold mb-4 flex items-center">
              <FaBrain className="mr-2 text-teal" />
              Select Script
            </h3>
            <div className="relative">
              <select
                value={selectedScript}
                onChange={(e) => {
                  setSelectedScript(e.target.value);
                  setShowError(false);
                  setPlotImage('');
                  setPlotError('');
                }}
                disabled={!selectedSector}
                className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-navy
                         appearance-none focus:ring-2 focus:ring-teal/20 focus:border-teal 
                         transition-all pr-10 disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="" disabled>
                  {selectedSector ? 'Select script' : 'First select sector'}
                </option>
                {sectors[selectedSector]?.map((script) => (
                  <option key={script} value={script}>{script}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <FaChevronDown className="w-4 h-4 text-navy" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={handlePredict}
            className="bg-navy hover:bg-navy/90 text-white px-8 py-3 rounded-lg font-medium
                     transform transition-all duration-200 hover:scale-105 active:scale-95 
                     shadow-lg hover:shadow-navy/20 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <FaChartLine className="mr-2" />
                Generate Prediction
              </>
            )}
          </button>

          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            disabled={!plotImage}
            className={`bg-teal hover:bg-teal/90 text-white px-8 py-3 rounded-lg font-medium
                     transform transition-all duration-200 hover:scale-105 active:scale-95 
                     shadow-lg hover:shadow-teal/20 flex items-center justify-center
                     ${!plotImage ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaRobot className="mr-2" />
            {showAIPanel ? 'Close Analysis' : 'AI Insights'}
          </button>
        </div>

        {/* Error Message */}
        {plotError && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-red-50 text-red-600 px-4 py-2 rounded-lg">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {plotError}
            </div>
          </div>
        )}

        {/* Prediction Chart */}
        {plotImage && (
          <div className="mt-8 max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-navy mb-4 flex items-center">
              <FaChartLine className="mr-2 text-teal" />
              {selectedScript} Prediction Chart
            </h3>
            <div className="relative overflow-hidden rounded-xl border border-gray-200">
              <img
                src={plotImage}
                alt={`Prediction for ${selectedScript}`}
                className="w-full h-auto object-contain hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
            </div>
          </div>
        )}

        {/* AI Analysis Panel */}
        {showAIPanel && plotImage && (
          <div className="absolute top-0 right-2 bottom-0 w-full max-w-md bg-white
                       rounded-xl shadow-xl border border-gray-200 flex flex-col z-50">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-navy flex items-center">
                <FaRobot className="mr-2 text-teal" />
                AI Analysis
              </h2>
              <button
                onClick={() => {
                  setShowAIPanel(false);
                  setHasRequestedAnalysis(false);
                  setAnalysis('');
                }}
                className="text-gray-400 hover:text-navy transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {!hasRequestedAnalysis ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="mb-6">
                    <FaBrain className="w-16 h-16 text-teal" />
                  </div>
                  <p className="text-gray-600 mb-6 px-3">
                    Get AI-powered market insights with real-time technical analysis and predictive forecasting.
                  </p>
                  <button
                    onClick={handleAskGemini}
                    className="bg-navy hover:bg-navy/90 text-white px-6 py-3 rounded-lg 
                             font-medium transform transition-all duration-200 hover:scale-105 
                             active:scale-95 shadow-lg flex items-center"
                  >
                    <FaBrain className="mr-2" />
                    Analyze Now
                  </button>
                </div>
              ) : (
                <>
                  {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal border-t-transparent mb-4"></div>
                      <p className="text-navy font-medium animate-pulse">
                        Analyzing market patterns...
                      </p>
                    </div>
                  ) : (
                    <div className="prose max-w-none">
                      <ReactMarkdown
                        components={{
                          h3: ({ node, ...props }) => (
                            <h3 className="text-navy text-lg font-semibold mb-3" {...props} />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="text-gray-600 mb-4 leading-relaxed" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc pl-4 mb-4 space-y-2 text-gray-600" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong className="text-navy font-semibold" {...props} />
                          )
                        }}
                      >
                        {analysis}
                      </ReactMarkdown>
                      <button
                        onClick={handleAskGemini}
                        className="mt-6 bg-teal hover:bg-teal/90 text-white px-6 py-3 rounded-lg
                                 font-medium transition-all duration-200 w-full flex items-center 
                                 justify-center"
                      >
                        <FaSync className="mr-2" />
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
    </div>
  );
};

export default Prediction;