import React from 'react'
import "./SplashScreen.css" 

const SplashScreen = () => {
  return (
    <div className='splash-container'>
        <div className='splash-content'>
            <img src='/imagens/callidus-logo.png' alt='Logo' className='splash-logo'/>
        </div>      
    </div>
  );
};

export default SplashScreen;