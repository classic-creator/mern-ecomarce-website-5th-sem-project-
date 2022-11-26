import React, { Fragment } from 'react'
import "./Product.css"
import { useSelector, useDispatch } from 'react-redux'
import {clearErrors,  getProduct } from '../../actions/productAction'
import Loader from '../layout/loader/loader'
import ProductCard from '../Home/ProductCard'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Pagination from "react-js-pagination"
import { useState } from 'react'
import Slider from "@material-ui/core/Slider"
import Typography from "@material-ui/core/Typography"
import {useAlert} from "react-alert"
import MetaData from '../layout/MetaData'
const categories =[ 
    "Laptop",
    "Footware",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
    "Sports"
]
const Products = () => {
    const dispatch = useDispatch()

    const alert=useAlert()
    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([0,25000])
    const [category, setCategory] = useState("")
    const [ratings, setRatings] = useState(0)

    const { products, loading, error, productsCount, resultPerPage } = useSelector(state => state.products)

    const { keyword } = useParams()

    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }

    const priceHandler=(event,newPrice)=>{
        setPrice(newPrice)

    }
    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors())
        }
        dispatch(getProduct(keyword, currentPage,price,category,ratings))
    }, [dispatch, keyword, currentPage,price,category,ratings,alert,error]);


   

    return (
        <Fragment>
            {loading ? (<Loader />) : (<Fragment>
                <MetaData title="PRODUCTS -- ECOMARCE"/> 
                <h2 className='productsHeading'>Products</h2>
                <div className="products">
                    {products && products.map((product) => (<ProductCard key={product._id} product={product} />))}
                </div>

                <div className="filterBox">
                    <Typography>price</Typography>
                    <Slider
                        value={price}
                        onChange={priceHandler}
                        valueLabelDisplay="auto"
                        aria-labelledby='range-slider'
                        min={0}
                        max={25000}
                    />
                    <Typography>Categori</Typography>
                    <ul className='categoryBox'>
                        {categories.map((category)=>(
                            <li className='category-link' key={category} onClick={()=>setCategory(category)}>{category}</li>
                        ))}

                    </ul>
                    <fieldSet>
                        <Typography component="legend">Rating Above</Typography>
                        <Slider
                        value={ratings}
                        onChange={(e ,newRating)=>{
                            setRatings(newRating)
                        }}
                        aria-labelledby="continuous-slider"
                        min={0}
                        max={5}
                        valueLabelDisplay="auto"
                        />
                    </fieldSet>
                </div>

                {resultPerPage <productsCount && <div className="pagination">
                    <Pagination
                        activePage={currentPage}
                        itemsCountPerPage={resultPerPage}
                        totalItemsCount={productsCount}
                        onChange={setCurrentPageNo}
                        nextPageText="next"
                        prevPageText="prev"
                        firstPageText="1st"
                        lastPageText="last"
                        itemClass='page-item'
                        linkClass='page-link'
                        activeClass='pageItemActive'
                        activeLinkClass='pageLinkActive'
                    />

                </div>}

            </Fragment>)}
        </Fragment>)

}

export default Products;