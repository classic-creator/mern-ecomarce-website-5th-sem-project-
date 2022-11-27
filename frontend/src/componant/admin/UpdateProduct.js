
import { Button } from '@material-ui/core'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Fragment } from 'react'
import { useAlert } from 'react-alert'
import { MdAccountTree, MdAttachMoney, MdDescription, MdSpellcheck, MdStorage } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { clearErrors, updateProduct,getProductDetails } from '../../actions/productAction'
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants'
import MetaData from '../layout/MetaData'
import Sidebar from './Sidebar'
import "./newProduct.css"

const UpdateProduct = () => {
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()
    const {id}=useParams()

    
    const { loading, error:updateError, isUpdeted} = useSelector(state => state.product)
    const {error,product}=useSelector(state=>state.productDetails)



    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [stock, setStock] = useState("")
    const [oldImages,setOldImages]=useState([])
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
    const productId=id

    useEffect(() => {

        if
        (product && product._id !==productId){

            dispatch(getProductDetails(productId))

        }else
        {
            setName(product.name)
            setDescription(product.description)
            setPrice(product.price)
            setCategory(product.category)
            setStock(product.stock)
            setOldImages(product.images)
        }

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (updateError) {
            alert.error(updateError)
            dispatch(clearErrors())
        }

        if (isUpdeted) {
            alert.success(" product updeted successfully")
            navigate("/admin/products")
            dispatch({ type: UPDATE_PRODUCT_RESET })
        }
    }, [dispatch, alert, error, isUpdeted, navigate,product,productId,updateError])

    const updateProductSubmitHandler = (e) => {
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
        dispatch(updateProduct(productId, myForm))
    }

    const updateProductImageChange = (e) => {
        const files = Array.from(e.target.files)

        setImages([])
        setImagesPreview([])
        setOldImages([])

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
            <MetaData title="Update product" />
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer">
                    <form encType='multipart/form-data' className="createProductForm" onSubmit={updateProductSubmitHandler}>
                        <h1>Update Product</h1>
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
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
                                value={stock}
                                required
                                onChange={(e) => setStock(e.target.value)}
                            />
                        </div>
                        <div id="createProductFormFile">
                            <input type="file" name="avater" accept='image/*' id="" multiple  onChange={updateProductImageChange}/>
                        </div>
                        
                        <div id="createProductFormImage">
                            {oldImages && oldImages.map((image, index) => (
                                <img src={image.url} alt="product preview" key={index} />
                            ))}
                        </div>
                        
                        <div id="createProductFormImage">
                            {imagesPreview.map((image, index) => (
                                <img src={image} alt="product preview" key={index} />
                            ))}
                        </div>
                        <Button
                            id="createProductBtn"
                            type="submit"
                            disabled={loading ? true : false}>
                           Update
                        </Button>
                    </form>
                </div>
            </div>
        </Fragment>

    )
}


export default UpdateProduct