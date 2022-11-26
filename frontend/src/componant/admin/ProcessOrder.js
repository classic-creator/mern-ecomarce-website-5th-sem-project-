import React, { useEffect, useState } from 'react'
import Loader from '../layout/loader/loader'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layout/MetaData'
import { Link, useParams } from "react-router-dom";
import { Button, Typography } from '@material-ui/core'
import { Fragment } from 'react'
// import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAlert } from 'react-alert';
import { clearErrors, getOrderDetails, updateOrder } from '../../actions/orderAction';
import { MdAccountTree } from 'react-icons/md';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';
import "./processOrder.css"

const ProcessOrder = () => {

  const { order, error, loading } = useSelector(state => state.orderDetails)
  const { error: updateError, isUpdated } = useSelector(state => state.order)


  // const navigate=useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const alert = useAlert()

  const processOrder = (e) => {
    e.preventDefault()

    const myForm = new FormData()

    myForm.set("status", status)

    dispatch(updateOrder(id, myForm))

  }

  const [status, setStatus] = useState("")

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
    if (updateError) {
      alert.error(updateError)
      dispatch(clearErrors())
    }
    if (isUpdated) {
      alert.success("Order updated successfully")
      dispatch({ type: UPDATE_ORDER_RESET })
    }
    dispatch(getOrderDetails(id))
  }, [dispatch, alert, error, isUpdated, updateError, id])





  return (

    <Fragment>
      <MetaData title="Process Order" />
      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          {loading ? (<Loader />) :
            (<div className="confirmOrderPage"  style={{display:order.orderStatus==="Delivered" ? "block" : "grid"}}>
              <div>
                <div className="confirmshippingArea">
                  <Typography>Shipping Info</Typography>
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
                       ₹ {order.totalPrice && order.totalPrice}
                      </span>
                    </div>
                  </div>
                  <Typography>
                    Order status :
                  </Typography>
                  <div className="orderDetailsContainerbox">
                    <div>
                      <p
                        className={order.orderStatus && order.orderStatus === "Delivered" ? "greenColor" : "redColor"}>
                        {order.orderStatus && order.orderStatus}
                      </p>
                    </div>
                  </div>


                </div>
                <div className="confirmCartItems">
                  <Typography>Order Items</Typography>
                  <div className="confirmCartItemsContainer">
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

              {/* */}
              <div style={{display:order.orderStatus==="Delivered" ? "none" : "block"}}>
                <form className="createProductForm" onSubmit={processOrder}>
                  <h1>Process order </h1>



                  <div>
                    <MdAccountTree />
                    <select onChange={(e) => setStatus(e.target.value)}>
                      <option value="">choose category</option>
                     {order.orderStatus === "processing" && ( <option value="shipped">Shipped</option>)}
                     {order.orderStatus==="shipped" && ( <option value="Delivered">Delivered</option>)}

                    </select>
                  </div>




                  <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={loading ? true : false || status === "" ? true : false}>
                    Process
                  </Button>
                </form>
              </div>
            </div>)}
        </div>
      </div>
    </Fragment>





  )
}






export default ProcessOrder