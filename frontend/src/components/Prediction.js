import React, { useState, useEffect } from 'react';

const Prediction = () => {
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedScript, setSelectedScript] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showContent, setShowContent] = useState(true); // Track visibility of image and text
  const [sectorVisible, setSectorVisible] = useState(false); // Track sector visibility
  const [fadeOut, setFadeOut] = useState(false); // Track fade out for image and text

  const texts = [
    "Calm your spirit.",
    "The path you seek lies here.",
    "Under my guidance, you shall glimpse the light that unveils the mysteries of the stock."
  ];

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentTextIndex < texts.length - 1) {
      const timer = setTimeout(() => {
        setCurrentTextIndex(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // After displaying all the text, start the fade-out animation
      const contentTimer = setTimeout(() => {
        setFadeOut(true);  // Start fading out the content
        setTimeout(() => {
          setShowContent(false);  // Hide image and text
          setSectorVisible(true);  // Show sector selection after fade out
        }, 1000); // Wait for the fade-out animation to complete
      }, 2000); // Wait until all texts are shown before starting fade-out

      return () => clearTimeout(contentTimer);
    }
  }, [currentTextIndex, texts.length]);

  const sectors = {
    'commercial bank': ['SCB', 'NABIL'],
    'development bank': ['JBBL', 'GBBL']
  };

  const handleSectorChange = (e) => {
    setSelectedSector(e.target.value);
    setSelectedScript('');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Image and Text Section */}
        {showContent && (
          <div className={`flex flex-col items-center mb-12 transition-all duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            {/* Image */}
            <img 
              src="/sage.jpg" 
              alt="Wise Sage" 
              className="w-96 h-96 object-cover mb-8 rounded-lg shadow-lg transition-opacity duration-1000"
            />
            {/* Text */}
            <div className="text-center space-y-4">
              {texts.slice(0, currentTextIndex + 1).map((text, index) => (
                <p 
                  key={index} 
                  className={`text-2xl font-serif text-gray-800 transition-all duration-1000 
                    ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                  {text}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Sector Selection Section */}
        {sectorVisible && (
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Sector
                </label>
                <select 
                  value={selectedSector}
                  onChange={handleSectorChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select a sector</option>
                  <option value="commercial bank">Commercial Bank</option>
                  <option value="development bank">Development Bank</option>
                </select>
              </div>

              {selectedSector && (
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Select Script
                  </label>
                  <select
                    value={selectedScript}
                    onChange={(e) => setSelectedScript(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select a script</option>
                    {sectors[selectedSector].map(script => (
                      <option key={script} value={script}>{script}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedSector && selectedScript && (
                <div className="flex justify-center">
                  <button 
                      className="mt-6 bg-[rgb(34,197,94)] text-[rgb(0,0,0)] font-bold px-4 py-2 rounded-lg 
                      hover:bg-[rgb(9, 33, 19)] hover:text-[rgb(255,255,255)] transition-colors duration-200 
                      focus:outline-none focus:ring-2 focus:ring-[rgb(34,197,94)] 
                      border-0 inline-block"
                   
                    onClick={() => {
                      console.log('Predicting for:', selectedScript);
                    }}
                  >
                    Predict
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prediction;
