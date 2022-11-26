import React, { Fragment, useEffect, useRef } from 'react'
import CheckoutSteps from '../Cart/CheckoutSteps'
import { useSelector, useDispatch } from 'react-redux'
import MetaData from '../layout/MetaData'
import { Typography } from '@material-ui/core'
import { useAlert } from 'react-alert'
import { CardCvcElement, useStripe, useElements, CardNumberElement, CardExpiryElement } from "@stripe/react-stripe-js"
import axios from 'axios'
import "./payment.css"
import { MdCreditCard, MdEvent, MdVpnKey } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { clearErrors, createOrder } from '../../actions/orderAction'



const Payment = () => {


    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"))

    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate=useNavigate()
    const stripe = useStripe()
    const elements = useElements()
    const payBtn = useRef(null)

    const { shippingInfo, cartItems } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.user)
    const { error } = useSelector(state => state.newOrder)

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100),
      };

      const order ={
        shippingInfo,
        orderItems:cartItems,
        itemsPrice:orderInfo.subtotal,
        taxPrice:orderInfo.tax,
        shippingPrice:orderInfo.shippingCharges,
        totalPrice:orderInfo.totalPrice
      }

    const submitHandler = async (e) => {

        e.preventDefault();

        payBtn.current.disabled = true;

        try {
            const config = {
                headers: {
                    "Contant-Type": "application/json"
                },
            };
            const { data } = await axios.post("/api/v1/payment/process", paymentData, config);


            const client_secret = data.client_secret;

            if (!stripe || !elements) {
                return;
            }

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country

                        },
                    }
                }
            })
            if (result.error) {
                payBtn.current.disabled = false
                alert.error(result.error.message)
            }
            else {
                if (result.paymentIntent.status === "succeeded") {

                    order.paymentInfo={
                        id:result.paymentIntent.id,
                        payStatus:result.paymentIntent.status
                    }
                    dispatch(createOrder(order))


                    navigate("/success")
                }else{
                    alert.error("there is some issu while processing payment")
                }
            }
        } catch (error) {
            payBtn.current.disable = false
            alert.error(error.response.data.message)
        }
    }

useEffect(() => {
  if(error){
    alert.error(error.response.data.message)
    dispatch(clearErrors())
  }

}, [dispatch,alert,error])



    return (
        <Fragment>
            < MetaData title="payment" />
            <CheckoutSteps activeStep={2} />
            <div className="paymentContainer">
                <form className='paymentForm' onSubmit={(e) => submitHandler(e)}>
                    <Typography>
                        Card info
                    </Typography>
                    <div>
                        <MdCreditCard />
                        <CardNumberElement className='paymentInput' />
                    </div>
                    <div>
                        <MdEvent />
                        <CardExpiryElement className='paymentInput' />
                    </div>
                    <div>
                        <MdVpnKey />
                        <CardCvcElement className='paymentInput' />
                    </div>

                    <input type="submit" value={`pay -₹${orderInfo && orderInfo.totalPrice}`} ref={payBtn} className="paymentFormBtn" />
                </form>
            </div>
        </Fragment>
    )
}

export default Payment