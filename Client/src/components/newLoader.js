
import React from 'react';

const Loader = ({ loaderType = 'video', loaderSrc = '/Animation - 1725987339328.webm', altText = 'Loading...', size = 'h-20 w-20' }) => {
  if (loaderType === 'video') {
    return (
      <div className="flex justify-center items-center h-full">
        <video src={loaderSrc} autoPlay loop className={size} />
      </div>
    );
  }
  
  // Fallback to a spinner or any other loader if needed
  return (
    <div className="flex justify-center items-center h-full">
      <div className={`loader-spinner ${size}`} />
      <span className="ml-2">{altText}</span>
    </div>
  );
};

export default Loader;
