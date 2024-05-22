import React from "react";

function Home() {
  const buttonStyle = {
    borderRadius: "50%",
    width: "100px",
    height: "100px",
    backgroundColor: "#e4a80e",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    top: "20px",
    right: "20px",
    zIndex: "999",
  };
  return (
    <div>
      <button style={buttonStyle}>Home</button>
    </div>
  );
}

export default Home;
