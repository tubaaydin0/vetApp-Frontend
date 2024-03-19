import React from 'react';
import './ErrorModal.css'
import errorPicture from "../../assets/errorPicture.png";
function ErrorModal({ error}) {
  return (
    <div className='error-content'>
      <img src={errorPicture} alt="dikkat gorseli" width= "6%"/>
      <p>{error}</p>
      
    </div>
  );
}

export default ErrorModal;
