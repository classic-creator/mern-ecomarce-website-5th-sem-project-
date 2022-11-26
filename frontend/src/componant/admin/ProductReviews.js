import React, { useState } from 'react'
import { Fragment } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import {DataGrid} from "@material-ui/data-grid"
import {  MdDelete, MdStar} from 'react-icons/md'
import { Button } from '@material-ui/core'
import MetaData from '../layout/MetaData'
import Sidebar from './Sidebar'
import {  useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { clearErrors, deleteReview, getAllReviews} from '../../actions/productAction'
import "./productReviews.css"
import { DELETE_REVIEW_RESET } from '../../constants/productConstants'



const ProductReviews = () => {

    const dispatch=useDispatch()
    const navigate=useNavigate()
    const alert=useAlert()


    const {error,reviews,loading}=useSelector(state=>state.productReviews)
    const {error:deleteError,isDeleted}=useSelector(state=>state.review)

    const [productId, setProductId] = useState("");



    const deleteReviewHandler = (reviewId) => {
        dispatch(deleteReview(reviewId, productId));
      };

      const productReviewsSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(getAllReviews(productId));
      };

    useEffect(()=>{

        if(productId.length===24){
            dispatch(getAllReviews(productId))
        }


        if(error){
            alert.error(error);
            dispatch(clearErrors())
        }

        if(deleteError){
          alert.error(deleteError);
          dispatch(clearErrors())
      }
      if(isDeleted){
        alert.success("Review delete successfully")
        navigate("/admin/reviews")
        dispatch({type:DELETE_REVIEW_RESET})
      }

        
    },[dispatch,error,alert,deleteError,isDeleted,navigate,productId])

    
    const columns = [
        { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },
    
        {
          field: "user",
          headerName: "User",
          minWidth: 150,
          flex: 0.3,
        },
        {
          field: "comment",
          headerName: "Comment",
       
          minWidth: 150,
          flex: 0.3,
        },
    
        {
          field: "rating",
          headerName: "Rating",
          type: "number",
          minWidth: 150,
          flex: 0.3,
          cellClassName:(params)=>{
            return params.getValue(params.id,"rating")>= 3 ? "greenColor" : "redColor"
          }
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
            
                <Button
                  onClick={() =>
                    deleteReviewHandler(params.getValue(params.id, "id"))
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

reviews && reviews.forEach((item)=>{
    rows.push({
        id:item._id,
        rating:item.rating,
        comment:item.comment,
        user:item.name
    })
})

  return (
   <Fragment>
    <MetaData title={`ALL REVIEWS -- ADMIN`}/>
    <div className="dashboard">
        <Sidebar/>
        
        <div className="productReviewsContainer">
          <form
            className="productReviewsForm"
            onSubmit={productReviewsSubmitHandler}
          >
            <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

            <div>
              <MdStar/>
              <input
                type="text"
                placeholder="Product Id"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={
                loading ? true : false || productId === "" ? true : false
              }
            >
              Search
            </Button>
          </form>
            
          {reviews && reviews.length >0 ? (  <DataGrid 
            rows={rows}
            columns={columns}
            pageSize={11}
           rowsPerPageOptions={[11]}
            disableSelectionOnClick
            className='productListTable'
    autoHeight
         
            />) : (
                <h1 id="productReviewsFormHeading">No reviews found</h1>
            )}
        </div>
    </div>
   </Fragment>
  )
}



export default ProductReviews