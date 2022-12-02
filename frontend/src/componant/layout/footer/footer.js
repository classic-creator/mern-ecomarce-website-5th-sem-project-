import React from 'react'
import Playstore from "../../../images/playstore.png"
import Appstore from "../../../images/Appstore.png"
import "./footer.css"

export const footer = () => {
    return (

        <footer id="footer">

            <div className='leftFooter'>
                <h4>DOWNLOAD OUR APP</h4>
                <p>Download app for android and Ios mobil phone </p>
                <img src={Playstore} alt="playstore" />
                <img src={Appstore} alt="app store" />
            </div>

            <div className="midfooter">
                <h1>Ecomerce</h1>
                <p>high quality is our first priorty</p>
                <p>copyright 2022 &copy; himangshu khound</p>
            </div>

            <div className="rightfooter">

                <h4> Follow us</h4>
                <a href="/">Instagram</a>
                <a href="/">facebook</a>
            </div>
        </footer>
    )
}


export default footer