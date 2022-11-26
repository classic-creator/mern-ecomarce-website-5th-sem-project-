import React, { Fragment, useEffect } from 'react'
import "./myOrder.css"
import { DataGrid } from "@material-ui/data-grid"
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, myOrders } from '../../actions/orderAction'
import Loader from "../layout/loader/loader"
import { Link } from "react-router-dom"
import { useAlert } from "react-alert"
import MetaData from "../layout/MetaData"
import { Typography } from '@material-ui/core'
import {MdLaunch }from "react-icons/md"

const Myorders = () => {

  const dispatch = useDispatch()
  const alert = useAlert()
  const { loading, error, orders } = useSelector(state => state.myOrders)
  const { user } = useSelector(state => state.user)


  const columns = [
    {
      field: "id", headerName: "Order Id", minWidth: 300, flex:1
    },
    {

      field: "status", headerName: "status", minWidth: 150, flex: 0.3,
      cellClassName:(params)=>{
        return params.getValue(params.id,"status")==="Delivered" ? "greenColor" : "redColor"
      }
    },
    {
      field:"itemsQty" ,headerName:"Items Qty",type:"number" ,minWidth:150,flex:0.3
    },
    {
      field:"amount" ,type:"number",headerName:"Amount", minWidth:150,flex:0.3
    },
    {
      field:"actions" , type:"number",headerName:"Actions" ,minWidth:150,flex:0.3,sortable:false, 
      renderCell:(params)=>{
        return(
          <Link to={`/order/${params.getValue(params.id,"id")}`}>
          <MdLaunch />
          </Link>
        )
      }
    }
  ]
  const rows = []
  orders && orders.forEach((item,index)=>{

    rows.push({
      itemsQty:item.orderItems.length,
      id:item._id,
      status:item.orderStatus,
      amount:item.totalPrice
    })
  })

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
    dispatch(myOrders())

  }, [error, dispatch, alert])

  return (
    <Fragment>
      <MetaData title={`${user.name}--order`} />

      {
        loading ? (<Loader />) : (
          <div className="myOrdersPage">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              className='myOrderTable'
              autoHeight
            />
            <Typography id='myOrdersHeading'>{user.name}'s Orders</Typography>


          </div>
        )
      }
    </Fragment>
  )
}

export default Myorders