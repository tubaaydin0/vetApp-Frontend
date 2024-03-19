import React from 'react'
import './Homepage.css'
import homepage from "../../assets/vetApp.png";


function Homepage() {

    return (
        <div className='container'>
            <div className="homepage-space">
                <div className="homepage-title">
                        <h1>VET VETERİNER KLİNİĞİ</h1>
                </div>
                <img src= {homepage} width="30%" alt="homepage-image" />
                

            </div>

        </div>
            
    )
}

export default Homepage;