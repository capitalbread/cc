import React, { useState } from 'react';

const ProductSort = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Sort By");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowDropdown(false); // Hide dropdown after selection
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {selectedOption}
      </button>

      {showDropdown && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            listStyleType: "none",
            margin: 0,
            padding: "10px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <li
            onClick={() => handleOptionClick("Price - Low to High")}
            style={{ padding: "5px", cursor: "pointer" }}
          >
            Price - Low to High
          </li>
          <li
            onClick={() => handleOptionClick("Price - High to Low")}
            style={{ padding: "5px", cursor: "pointer" }}
          >
            Price - High to Low
          </li>
          <li
            onClick={() => handleOptionClick("Newest")}
            style={{ padding: "5px", cursor: "pointer" }}
          >
            Newest
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProductSort;


