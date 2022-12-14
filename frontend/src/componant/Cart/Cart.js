import React, { Fragment } from 'react'
import "./Cart.css"
import CartItemCard from "./CartItemCard.js"
import {useDispatch, useSelector} from"react-redux"
import { addItemToCart,removeItemsFromCart } from '../../actions/cardAction'
import { MdRemoveShoppingCart } from 'react-icons/md'
import { Typography } from '@material-ui/core'
import {Link} from "react-router-dom"
import { useNavigate } from 'react-router-dom'

const Cart = () => {

  const navigate=useNavigate()
  const dispatch=useDispatch()
  const {cartItems}= useSelector((state)=>state.cart)

  const increseQuantity=(id,quantity,stock)=>{
    const newQty=quantity+1;
    if(stock<=quantity){
      return
    }
    dispatch(addItemToCart(id,newQty))
  }
  
  const decreaseQuantity = (id,quantity)=>{
    const newQty=quantity-1
    if (1>=quantity){
      return
    }
    dispatch(addItemToCart(id,newQty))
  }
  const deleteCartItems=(id)=>{
    dispatch(removeItemsFromCart(id))
  }
  const checkOutHandler=()=>{
    navigate("/login?redirect=shipping")
  }

  return (
 <Fragment>
  {cartItems.length ===  0 ? (
    <div className="emptyCart">
      <MdRemoveShoppingCart/>
      <Typography>No product in the cart</Typography>
      <Link to="/products"> view product </Link>
    </div>
  )   :   (<Fragment>
   <div className="cartPage">
       <div className="cartHeader">
         <p>Product</p>
         <p>Quantity</p>
         <p>Subtotal</p>
         </div>
         {cartItems && cartItems.map((item)=>(
           <div className="cartContainer" key={item.product}>
           <CartItemCard item={item} deleteCartItems={deleteCartItems}/>
           <div className="cartInput">
             <button onClick={()=>decreaseQuantity(item.product,item.quantity)}>-</button>
             <input type="number" readOnly value={item.quantity}/>
             <button onClick={()=>increseQuantity(item.product,item.quantity,item.stock)}>+</button>
           </div>
           <p className="subtotal" >{`₹${item.price*item.quantity}`}</p>
         </div>
         ))}
         <div className="cartGrossTotal">
           <div></div>
           <div className="cartGrossTotalBox">
             <p>GROSS TOTAL</p>
             <p>{`₹${cartItems.reduce(
              (acc,item)=>acc+item.quantity*item.price,
              0
             )}`}</p>
           </div>
           <div></div>
           <div className="chackOutBtn">
             <button onClick={checkOutHandler}>Check Out</button>
           </div>
         </div>
   </div>
 </Fragment>)}
 </Fragment>
  );
};

export default Cart;