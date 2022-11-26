import React, { Fragment, useState } from 'react'
import "./shipping.css"
import { useDispatch, useSelector } from 'react-redux'
import { saveShippingInfo } from '../../actions/cardAction'
import MetaData from '../layout/MetaData'
import { Country, State } from "country-state-city"
import { useAlert } from 'react-alert'
import { MdHome, MdLocationCity, MdPhone, MdPinDrop, MdPublic, MdTransferWithinAStation } from 'react-icons/md'
import CheckoutSteps from "../Cart/CheckoutSteps.js"
import { useNavigate } from 'react-router-dom'

const Shipping = () => {

    const navigate=useNavigate()
    const dispatch = useDispatch()
    const alert = useAlert()
    const { shippingInfo } = useSelector(state => state.cart)

    const [address, setAddress] = useState(shippingInfo.address)
    const [city, setCity] = useState(shippingInfo.city)
    const [state, setState] = useState(shippingInfo.state)
    const [country, setCountry] = useState(shippingInfo.country)
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode)
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo)

    const shippingSubmit = (e) => {
        e.preventDefault();
        if(phoneNo.length<10 || phoneNo.length>10){
            alert.error("phone no should be 10 digit")
            return;
        }
        dispatch(
            saveShippingInfo({address,city,state,country,pinCode,phoneNo})
        );
        navigate("/order/confirm")
     }

    return (

        <Fragment>
            <MetaData title="Shipping Details" />
            <CheckoutSteps activeStep={0}/>
            <div className="shippingContainer">
                <div className="shippingBox">
                    <h2 className='shippingHeading'>Shipping Heading</h2>
                    <form className='shippingForm' encType='multipart/form-data' onSubmit={shippingSubmit}>
                        <div>
                            <MdHome />
                            <input type="text" placeholder='address' required value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>

                        <div>
                            <MdLocationCity />
                            <input type="text" placeholder='city' required value={city} onChange={(e) => setCity(e.target.value)} />
                        </div>

                        <div>
                            <MdPinDrop />
                            <input type="text" placeholder='pinCode' required value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
                        </div>

                        <div>
                            <MdPhone />
                            <input type="text" placeholder='phonNo' required value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
                        </div>
                        <div>
                            <MdPublic />
                            <select required value={country} onChange={(e) => setCountry(e.target.value)}>
                                <option value="">country</option>
                                {Country && Country.getAllCountries().map((item) => (<option key={item.isoCode} value={item.isoCode}>
                                    {item.name}
                                </option>))}
                            </select>
                        </div>
                        {country && (
                            <div>
                                <MdTransferWithinAStation />

                                <select required value={state} onChange={(e) => setState(e.target.value)}>
                                    <option value="">state</option>
                                    {State && State.getStatesOfCountry(country).map((item) => (
                                        <option value={item.isoCode} key={item.isoCode}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <input type="submit" value="Continue" className="shippingBtn" disabled={state ? false : true} />
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default Shipping