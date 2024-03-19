import React from 'react'
import './Homepage.css'
import { useNavigate } from 'react-router-dom'
//import login from "../../assets/images/login.png";


function Homepage() {

    const navigate = useNavigate();


    const handleStartButton = () => {
        navigate(`/questions`)
    }
    return (
        <div className='container'>
            <div className="homepage-space">
                <div className="homepage-title">
                        <h1>VET VETERİNER KLİNİĞİ</h1>
                </div>
                <img src="./src/assets/vetApp.png" width="30%" alt="homepage-image" />
                

            </div>

        </div>
            
    )
}

export default Homepage;