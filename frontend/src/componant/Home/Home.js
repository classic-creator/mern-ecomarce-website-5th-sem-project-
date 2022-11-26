import React, { Fragment, useEffect } from 'react'
import { CgMouse } from "react-icons/cg"
import "./Home.css"
import MetaData from '../layout/MetaData'
import {clearErrors, getProduct} from "../../actions/productAction.js"
import {useSelector, useDispatch} from "react-redux"
import Loader from '../layout/loader/loader'
import { useAlert } from 'react-alert'
import ProductCard from './ProductCard.js'


const Home = () => {

    const alert=useAlert();
    const dispatch=useDispatch();
    const {loading , error , products}= useSelector((state)=>state.products)

    useEffect(()=>{

        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }

    
        dispatch(getProduct());
    },[dispatch,error,alert]);

    return (
       <Fragment>
        {loading ? (<Loader/>) :  
        ( <Fragment>

            <MetaData title="ECOMARCE" />
            <div className="banner">
                <p>wellcome to ecomarce</p>
                <h1>FIND AMAZING PRODUCTS BELLOW</h1>

                <a href="#container">
                    <button>
                        scroll<CgMouse />
                    </button>
                </a>
            </div>
            <h2 className="HomeHeading">Featured Product</h2>

            <div className="container" id='container'>

              {products && products.map((product)=>(<ProductCard product={product}/>))}
            </div>

        </Fragment>)}
       </Fragment>
    )
}

export default Home