
import React from 'react'
import { Fragment } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import {DataGrid} from "@material-ui/data-grid"
import {  MdDelete, MdEdit } from 'react-icons/md'
import { Button } from '@material-ui/core'
import MetaData from '../layout/MetaData'
import Sidebar from './Sidebar'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import "./productList.css"

import { clearErrors, deleteOrder, getAllOrders } from '../../actions/orderAction'
import { DELETE_ORDER_RESET } from '../../constants/orderConstants'
const OrderList = () => {

    const dispatch=useDispatch()
    const navigate=useNavigate()
    const alert=useAlert()


    const {error,orders}=useSelector(state=>state.allorders)
    const {error:deleteError,isDeleted}=useSelector(state=>state.order)

    const deleteOrderHandler=(id)=>{
    
      dispatch(deleteOrder(id))
    }
    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors())
        }

        if(deleteError){
          alert.error(deleteError);
          dispatch(clearErrors())
      }
      if(isDeleted){
        alert.success("order delete successfully")
        navigate("/admin/orders")
        dispatch({type:DELETE_ORDER_RESET})
      }

        dispatch(getAllOrders())
    },[dispatch,error,alert,isDeleted,deleteError,navigate])


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
          field: "actions",
          flex: 0.3,
          headerName: "Actions",
          minWidth: 150,
          type: "number",
          sortable: false,
          renderCell: (params) => {
            return (
              <Fragment>
                <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
                  <MdEdit />
                </Link>
    
                <Button
                  onClick={() =>
                    deleteOrderHandler(params.getValue(params.id, "id"))
                  }
                >
                  < MdDelete/>
                </Button>
              </Fragment>
            );
          },
        },
      ];

const rows=[];

orders && orders.forEach((item)=>{
    rows.push({
        id:item._id,
        itemsQty:item.orderItems.length,
        amount:item.totalPrice,
        status:item.orderStatus
    })
})

  return (
   <Fragment>
    <MetaData title={`ALL ORDERS -- ADMIN`}/>
    <div className="dashboard">
        <Sidebar/>
        <div className="productListContainer">
            <h1 id='productListHeading'>All product</h1>
            <DataGrid 
            rows={rows}
            columns={columns}
            pageSize={11}
           rowsPerPageOptions={[11]}
            disableSelectionOnClick
            className='productListTable'
    autoHeight
         
            />
        </div>
    </div>
   </Fragment>
  )
}


export default OrderList