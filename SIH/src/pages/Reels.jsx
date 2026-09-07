import React, { useEffect } from 'react';
import './Reels.css';

export const Reels = () => {
  // Array of Instagram Reel IDs provided by the user
  const reelIds = [
    'DYpPU_HFuYs',
    'DaXovpYT6wN',
    'Da_9K8Dz7VD'
  ];

  // Instagram embeds require their embed.js script to resize and load properly sometimes
  useEffect(() => {
    // Add Instagram embed script to the document if not already there
    if (!window.instgrm) {
      const script = document.createElement('script');
      script.async = true;
      script.src = "https://www.instagram.com/embed.js";
      document.body.appendChild(script);
    } else {
      window.instgrm.Embeds.process();
    }
  }, []);

  return (
    <div className="reels-container">
      {reelIds.map((id, index) => (
        <div key={id} className="reel-item">
          <iframe 
            className="reel-iframe"
            src={`https://www.instagram.com/p/${id}/embed/captioned`}
            frameBorder="0"
            scrolling="no"
            allowTransparency="true"
            allowFullScreen={true}
            title={`Instagram Reel ${index + 1}`}
          />
        </div>
      ))}
    </div>
  );
};
