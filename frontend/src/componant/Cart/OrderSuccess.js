import React from 'react'
import "./OrderSuccess.css";
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { MdCheckCircle } from 'react-icons/md';


const OrderSuccess = () => {
  return (
   <div className="orderSuccess">
    <MdCheckCircle/>
    <Typography>
        your order placed successfully 

    </Typography>
    <Link to="/orders">view order</Link>
   </div>
  )
}

export default OrderSuccess