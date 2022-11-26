
import React, { useEffect, useState, Fragment } from 'react'

import Carousel from "react-material-ui-carousel"
import "./ProductDetails.css"
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, getProductDetails, newReview } from "../../actions/productAction"
import { useParams } from 'react-router-dom';

import ReviewCard from "./ReviewCard.js"
import Loader from "../layout/loader/loader"
import { useAlert } from "react-alert"
import MetaData from "../layout/MetaData"
import { addItemToCart } from '../../actions/cardAction'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@material-ui/core"
import {  Rating} from "@material-ui/lab";
import { NEW_REVIEW_RESET } from '../../constants/productConstants'


const ProductDetails = () => {


    const alert = useAlert()
    const dispatch = useDispatch()

    const { id } = useParams();
    const { product, loading, error } = useSelector((state) => state.productDetails)
    const {success, error:reviewError} = useSelector(state=>state.newReview)

    const [quantity, setQuantity] = useState(1)
    const [open, setOpen] = useState(false)
    const [comment, setComment] = useState("")
    const [rating, setRating] = useState(0)



    const incressQuantity = () => {


        if (product.stock <= quantity) return;

        const qtr = quantity + 1;

        setQuantity(qtr)
    }


    const decreaseQuantity = () => {
        if (1 >= quantity) return;
        const qtr = quantity - 1;
        setQuantity(qtr)
    }

    const addItemToCartHandler = () => {
        dispatch(addItemToCart(id, quantity))
        alert.success("item added to cart")
    }


    const submitReviewToggle=()=>{
        open ? setOpen(false): setOpen(true)
    }
    const reviewSubmitHandler=()=>{
        const myForm=new FormData()

        myForm.set("rating",rating)
        myForm.set("comment",comment)
        myForm.set("productId",id)

        dispatch(newReview(myForm))
        setOpen(false)
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (reviewError){
            alert.error(reviewError)
            dispatch(clearErrors())
        }
        if(success){
            alert.success("Review submitted successfully")
            dispatch({type:NEW_REVIEW_RESET})
        }
        dispatch(getProductDetails(id))
    }, [dispatch, id, error, alert,success,reviewError])


    const options = {
       
        size: "large",
        value: product.ratings,
      precision:0.5,
      readOnly:true
    }

    return (
        <Fragment>{loading ? (<Loader />) : (<Fragment>
            <MetaData title={`${product.name}--ECOMARCE`} />
            <div className='ProductDetails'>
                <div className='productDetails-1' >
                    <Carousel className="CarouselImage">


                        {product.images &&
                            product.images.map((item, i) => (
                                <img

                                    key={i}
                                    src={item.url}
                                    alt={`${i} Slide`}
                                />
                            ))}

                    </Carousel>
                </div>
                <div className='productDetails-1'>
                    <div className='detailsBlock-1'>
                        <h2>{product.name}</h2>
                        <p>Product #{product._id}</p>

                    </div>
                    <div className="detailsBlock-2">
                        <Rating {...options} />
                        <span className='detailsBlock-2-span'>({product.numOfReviews})</span>
                    </div>
                    <div className="detailsBlock-3">
                        <h1>{`₹${product.price}`}</h1>

                        <div className="detailsBlock-3-1">
                            <div className="detailsBlock-3-1-1">
                                <button onClick={decreaseQuantity}>-</button>
                                <input type="number" value={quantity} />
                                <button onClick={incressQuantity}>+</button>
                            </div>{" "}
                            <button className="cartButton" disabled={product.stock < 1 ? true : false} onClick={addItemToCartHandler}>add to cart</button>
                        </div>
                        <p>
                            Status:
                            <b className={product.stock < 1 ? "redColor" : "greenColor"}>

                                {product.stock < 1 ? "OutofStock" : "InStock"}
                            </b>

                        </p>
                    </div>
                    <div className="detailsBlock-4">
                        Description: <p>{product.description}</p>
                    </div>

                    <button className='submitReview' onClick={submitReviewToggle}> Submit Review</button>
                </div>
            </div>


            <h3 className='reviewsHeading'>REVIEWS</h3>

            <Dialog
                aria-labelledby="simple-dialog-title"
                open={open}
                onClose={submitReviewToggle}
            >
                <DialogTitle>Submit Review</DialogTitle>
                <DialogContent className='submitDialog'>
                    <Rating
                        onChange={(e) => setRating(e.target.value)}
                        value={rating}
                        size="large" />

                    <textarea
                        cols="30"
                        rows="5"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}

                        className="dialogTextArea"
                    
                    ></textarea>

                </DialogContent>
                <DialogActions>
                    <Button color='secondary' onClick={submitReviewToggle}>Cencle</Button>
                    <Button onClick={reviewSubmitHandler}>Submit</Button>
                </DialogActions>
            </Dialog>



            {product.reviews && product.reviews[0] ? (
                <div className='Reviews'>
                    {product.reviews && product.reviews.map((review) => (<ReviewCard key={review._id} review={review} />))}
                </div>
            ) : (
                <p className='noReviews'>NO REVIEWS YET</p>
            )}

        </Fragment>)}

        </Fragment>
    )
}

export default ProductDetails