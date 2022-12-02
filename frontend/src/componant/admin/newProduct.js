import { Button } from '@material-ui/core'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Fragment } from 'react'
import { useAlert } from 'react-alert'
import { MdAccountTree, MdAttachMoney, MdDescription, MdSpellcheck, MdStorage } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearErrors, createProduct } from '../../actions/productAction'
import { NEW_PRODUCT_RESET } from '../../constants/productConstants'
import MetaData from '../layout/MetaData'
import Sidebar from './Sidebar'
import "./newProduct.css"
const NewProduct = () => {

    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()

    const { loading, error, success } = useSelector(state => state.newProduct)

    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [stock, setStock] = useState("")
    const [images, setImages] = useState([])
    const [imagesPreview, setImagesPreview] = useState([])

    const categories = [
        "Laptop",
        "Footware",
        "Bottom",
        "Tops",
        "Attire",
        "Camera",
        "SmartPhones",
        "Sports"
    ]

    useEffect(() => {
        if (error) {

            alert.error(error)
            dispatch(clearErrors())
        }
        if (success) {
            alert.success("Create product successfully")
            navigate("/admin/product")
            dispatch({ type: NEW_PRODUCT_RESET })
        }
    }, [dispatch, alert, error, success, navigate])

    const createProductSubmitHandler = (e) => {
        e.preventDefault()
        const myForm = new FormData()

        myForm.set("name", name)
        myForm.set("price", price)
        myForm.set("description", description)
        myForm.set("category", category)
        myForm.set("stock", stock)


        images.forEach((image) => {
            myForm.append("images", image)
        })
        dispatch(createProduct(myForm))
    }

    const createProductImageChange = (e) => {
        const files = Array.from(e.target.files)

        setImages([])
        setImagesPreview([])

        files.forEach((file) => {

            const reader = new FileReader()
            
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result])
                    setImages((old) => [...old, reader.result])
                }
            }

            reader.readAsDataURL(file)
        })
    }

    return (
        <Fragment>
            <MetaData title="Create product" />
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer">
                    <form encType='multipart/form-data' className="createProductForm" onSubmit={createProductSubmitHandler}>
                        <h1>Create Product</h1>
                        <div>
                            <MdSpellcheck />
                            <input type="text"
                                placeholder='Product name'
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <MdAttachMoney/>
                            <input type="number"
                                placeholder='Price'
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div>
                            <MdDescription />
                            <textarea name="" placeholder='about product...' value={description} cols="30" rows="1"
                                onChange={(e) => setDescription(e.target.value)}></textarea>
                        </div>
                        <div>
                            <MdAccountTree />
                            <select onChange={(e) => setCategory(e.target.value)}>
                                <option value="">choose category</option>
                                {categories.map((cate) => (
                                    <option value={cate} key={cate}> {cate}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <MdStorage />
                            <input type="number"
                                placeholder='Stock'
                                required
                                onChange={(e) => setStock(e.target.value)}
                            />
                        </div>
                        <div id="createProductFormFile">
                            <input type="file" name="avater" accept='image/*' id="" multiple  onChange={createProductImageChange}/>
                        </div>
                        <div id="createProductFormImage">
                            {imagesPreview.map((image, index) => (
                                <img src={image} alt="avater preview" key={index} />
                            ))}
                        </div>
                        <Button
                            id="createProductBtn"
                            type="submit"
                            disabled={loading ? true : false}>
                            Create
                        </Button>
                    </form>
                </div>
            </div>
        </Fragment>

    )
}

export default NewProduct