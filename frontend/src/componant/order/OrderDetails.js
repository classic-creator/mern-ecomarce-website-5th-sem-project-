import React, { useEffect } from 'react'
import { Fragment } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Loader from '../layout/loader/loader'
import { clearErrors, getOrderDetails } from '../../actions/orderAction'
import MetaData from "../layout/MetaData"
import { Typography } from '@material-ui/core'
import {Link} from "react-router-dom"
import "./orderDetails.css"

const OrderDetails = () => {

    const { order, error, loading } = useSelector(state => state.orderDetails)

    const dispatch = useDispatch()
    const { id } = useParams()
    const alert = useAlert()


    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(getOrderDetails(id))
    }, [dispatch, alert, error, id])

    return (
        <Fragment>
            {loading ? (<Loader />) : (
                <Fragment>
                    <MetaData title="Order Details" />
                    <div className="orderDetailsPage">
                        <div className="orderDetailsContainer">
                            <Typography component="h1">Order #{order && order._id}</Typography>
                            <Typography>Shipping Info :</Typography>
                            <div className="orderDetailsContainerbox">
                                <div>
                                    <p>Name:</p>
                                    <span>{order.user && order.user.name}</span>
                                </div>
                                <div>
                                    <p>PhoneNo:</p>
                                    <span>{order.shippingInfo && order.shippingInfo.phoneNo}</span>
                                </div>
                                <div>
                                    <p>Address:</p>
                                    <span>
                                        {order.shippingInfo &&
                                            `${order.shippingInfo.address},${order.shippingInfo.city} , ${order.shippingInfo.state},${order.shippingInfo.pinCode},${order.shippingInfo.country}`
                                        }
                                    </span>
                                </div>
                            </div>
                            <Typography>Payment :</Typography>
                            <div className="orderDetailscontainerbox">
                                <div>
                                    <p className={
                                        order.paymentInfo && order.paymentInfo.payStatus === "succeeded" ? "greenColor" : "redColor"
                                    }>
                                        {
                                            order.paymentInfo && order.paymentInfo.payStatus === "succeeded" ? "PAID" : "NOTPAID"
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        Amount:
                                    </p>
                                    <span>
                                        {order.totalPrice && order.totalPrice}
                                    </span>
                                </div>
                            </div>
                            <Typography>
                                Order status :
                            </Typography>
                            <div className="orderDetailscontainerbox">
                                <div>
                                    <p
                                    className={order.orderStatus && order.orderStatus ==="delivered"? "greenColor":"redColor"}>
                                        {order.orderStatus && order.orderStatus}
                                        </p>
                                </div>
                            </div>
                          <div className="orderDetailsCartItems">
                          <Typography>
                                Order items :
                                </Typography>
                                <div className="orderDetailsCartItemsContainer">
                                {order.orderItems && order.orderItems.map((item) => (
                                    <div key={item.product}>
                                        <img src={item.image} alt="product" />
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>{" "}
                                        <span>
                                            {item.quantity} X ₹{item.price}={' '}
                                            <b>₹{item.price * item.quantity}</b>
                                        </span>
                                    </div>
                                ))}
                            </div>
                          </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default OrderDetails