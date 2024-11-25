// SearchBar.js
import React, { useState, useEffect } from 'react';
import { FormControl } from '@mui/material';
import ContentPasteSearchRoundedIcon from '@mui/icons-material/ContentPasteSearchRounded';

// Custom hook for typing animation with infinite loop
const useTypingEffect = (text, speed = 150, delay = 1000) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, currentIndex + 1));
      currentIndex++;
      if (currentIndex === text.length) {
        setTimeout(() => {
          setDisplayedText('');
          currentIndex = 0;
        }, delay); // Delay before starting the animation again
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, delay]);

  return displayedText;
};

const SearchBar = ({ filterText, setFilterText, handleSearchChange,searchText='' }) => {
  const placeholderText = useTypingEffect(`SEARCH ${searchText}`, 150, 1000);

  return (
    <FormControl sx={{ width: '100%' }}>
       <ContentPasteSearchRoundedIcon
    sx={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: 'gray',pointerEvents: 'none' }}
  />
      <input
        type="text"
        value={filterText}
        onChange={handleSearchChange}
        placeholder={placeholderText}
        className="flex-1 p-2 border rounded-md focus:outline-none focus:border-orange-600"
        style={{paddingLeft:'40px' ,boxShadow: '0px 4px 4px 0px rgba(219, 219, 219, 0.2509803922)',borderColor:'rgba(0,0,0,0.35)' }}
      />
    </FormControl>
  );
};

export default SearchBar;

