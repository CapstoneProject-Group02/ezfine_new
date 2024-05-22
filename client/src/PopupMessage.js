import React, { useState, useEffect } from "react";
import "./PopupMessage.css";

const PopupMessage = ({ message }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 8000); // Set the duration for the pop-up to stay visible (3000ms = 3s)

    return () => clearTimeout(timer);
  }, []);

  return <div className={`popup ${show ? "show" : ""}`}>{message}</div>;
};

export default PopupMessage;
