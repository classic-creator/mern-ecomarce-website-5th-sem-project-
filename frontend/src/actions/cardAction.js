import { ADD_TO_CARD, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO } from "../constants/cartConcent";
import axios from "axios";

//add to cart
export const addItemToCart = (id,quantity)=>async (dispatch,getState)=>{
    const {data} = await axios.get(`/api/v1/product/${id}`)

    dispatch({
        type:ADD_TO_CARD,
        payload:{
            product:data.product._id,
            name:data.product.name,
            price:data.product.price,
            image:data.product.images[0].url,
            stock:data.product.stock,
            quantity
        }
    })

    localStorage.setItem("cartItems" ,JSON.stringify(getState().cart.cartItems))
}

//remove from cart

export const removeItemsFromCart= (id)=> async (dispatch,getState)=>{
   dispatch({

       type:REMOVE_CART_ITEM,
       payload:id,
    }) 
    localStorage.setItem("cartItems" ,JSON.stringify(getState().cart.cartItems))
}



export const saveShippingInfo = (data) =>async (dispatch)=>{
 dispatch({
    type:SAVE_SHIPPING_INFO,
    payload:data,
 })
 localStorage.setItem("shippingInfo",JSON.stringify(data))
}