import React from 'react';
import './ErrorModal.css'

function ErrorModal({ error}) {
  return (
    <div className='error-content'>
      <img src="./src/assets/dikkat.png" alt="dikkat gorseli" width= "6%"/>
      <p>{error}</p>
      
    </div>
  );
}

export default ErrorModal;
