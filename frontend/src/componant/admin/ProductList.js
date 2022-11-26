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
import { clearErrors, deleteProduct, getAdminProduct } from '../../actions/productAction'
import "./productList.css"
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants'
const ProductList = () => {

    const dispatch=useDispatch()
    const navigate=useNavigate()
    const alert=useAlert()


    const {error,products}=useSelector(state=>state.products)
    const {error:deleteError,isDeleted}=useSelector(state=>state.product)

    const deleteProductHandler=(id)=>{
      dispatch(deleteProduct(id))
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
        alert.success("product delete successfully")
        navigate("/admin/dashboard")
        dispatch({type:DELETE_PRODUCT_RESET})
      }

        dispatch(getAdminProduct())
    },[dispatch,error,alert,deleteError,isDeleted,navigate])


    const columns = [
        { field: "id", headerName: "Product ID",
         minWidth: 150, 
         flex: 0.3 
        },
    
        {
          field: "name",
          headerName: "Name",
          minWidth: 100,
          flex: 0.3,
        },
        {
          field: "stock",
          headerName: "Stock",
          type: "number",
          minWidth: 100,
          flex:0.2,
        },
    
        {
          field: "price",
          headerName: "Price",
          type: "number",
          minWidth: 100,
          flex: 0.3,
        },
    
        {
          field: "actions",
          flex: 0.2,
          headerName: "Actions",
          minWidth: 100,
          type: "number",
          sortable: false,
          renderCell: (params) => {
            return (
              <Fragment>
                <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
                  <MdEdit />
                </Link>
    
                <Button
                  onClick={() =>
                    deleteProductHandler(params.getValue(params.id, "id"))
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

products && products.forEach((item)=>{
    rows.push({
        id:item._id,
        stock:item.stock
        ,price:item.price,
        name:item.name
    })
})

  return (
   <Fragment>
    <MetaData title={`ALL PRODUCT -- ADMIN`}/>
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
            sx={{overflowX:"scroll"}}
            className='productListTable'
    autoHeight
         
            />
        </div>
    </div>
   </Fragment>
  )
}

export default ProductList