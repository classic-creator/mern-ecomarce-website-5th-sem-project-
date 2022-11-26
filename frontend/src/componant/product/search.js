import React from 'react'
import { useState } from 'react'
import { Fragment } from 'react'
import "./search.css"
import { useNavigate} from "react-router-dom"
import MetaData from '../layout/MetaData'

const Search = () => {

    const [keyword,setKeyword]=useState(" ") 

    const navigate = useNavigate(); 

    const searchSubmitHandler=(e)=>{
        e.preventDefault();
        if(keyword.trim())
        {
            navigate(`/products/${keyword}`)
        }else{
            navigate("/products")
        }
    }


  return (
    <Fragment>
        <MetaData title="Search a Product-- ECOMARCE"/> 
        < form className='searchBox' onSubmit={searchSubmitHandler}>
        <input type="text" placeholder='search a product' onChange={(e)=>setKeyword(e.target.value)}/>
        <input type="submit" value="Search" />
        </form></Fragment>)

}

export default Search;