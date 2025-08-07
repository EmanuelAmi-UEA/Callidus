import React from 'react'
import "/src/SplashScreen.css" // Import your CSS for splash screen

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