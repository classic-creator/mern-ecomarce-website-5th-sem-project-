
import './App.css';
import Header from "./componant/layout/header/Header.js"
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { useEffect, useState } from 'react';
import webfont from "webfontloader"
import React from 'react';
import Footer from "./componant/layout/footer/footer.js"
import Home from "./componant/Home/Home.js"
import ProductDetails from "./componant/product/productDetails.js"
import Products from "./componant/product/Product.js"
import Search from "./componant/product/search.js"
import LoginSingUp from './componant/user/loginSingUp';
import store from "./store"
import { loadUser } from "./actions/userAction"
import UserOptions from "./componant/layout/header/userOptions.js"
import { useSelector } from 'react-redux';
import Profile from "./componant/user/Profile.js"
import ProtectedRoute from "./componant/route/ProtectedRoute.js"
import UpdateProfile from "./componant/user/UpdateProfile.js"
import UpdatePassword from "./componant/user/UpdatePassword.js"
import ForgotPassword from "./componant/user/ForgotPassword.js"
import ResetPassword from "./componant/user/ResetPassword.js"
import Cart from "./componant/Cart/Cart.js"
import Shipping from "./componant/Cart/Shipping.js"
import ConfirmOrder from "./componant/Cart/ConfirmOrder.js"
import axios from 'axios';
import Payment from "./componant/Cart/Payment.js"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import OrderSuccess from "./componant/Cart/OrderSuccess.js"
import myOrders from "./componant/order/Myorders.js"
import OrderDetails from "./componant/order/OrderDetails.js"
import Dashboard from "./componant/admin/Dashboard.js"
import ProductList from "./componant/admin/ProductList.js"
import NewProduct from "./componant/admin/newProduct.js"
import UpdateProduct from "./componant/admin/UpdateProduct.js"
import OrderList from "./componant/admin/OrderList.js"
import ProcessOrder from "./componant/admin/ProcessOrder.js"
import UsersList from "./componant/admin/UsersList.js"
import UpdateUser from "./componant/admin/UpdateUser.js"
import ProductReviews from "./componant/admin/ProductReviews.js"
import About from "./componant/layout/about/about.js"
import NotFound from "./componant/layout/NotFound/NotFound.js"




function App() {

  const { isAuthenticated, user } = useSelector(state => state.user)

  const [stripeApiKey, setStripeApiKey] = useState("")

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey")
    setStripeApiKey(data.stripeApiKey)
  }

  useEffect(() => {

    webfont.load({
      google: {
        families: ["Roboto", "Droid", "Chilanka" ]
      }
    })

    store.dispatch(loadUser())

    getStripeApiKey()

  }, [])
  return (
    <BrowserRouter>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      {/* {stripeApiKey &&
        (<Elements stripe={loadStripe(stripeApiKey)}>
            <ProtectedRoute exact path="/process/payment" component={Payment} /> </Elements>
        )} */}
      <Routes>

        <Route extact path='/' element={<Home />} />
        <Route extact path='/product/:id' element={<ProductDetails />} />
        <Route extact path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route extact path="/search" element={<Search />} />

        <Route exact path="/login" element={<LoginSingUp />} />


        <Route exact path='/account' element={<ProtectedRoute component={Profile} />} />
        <Route exact path='/me/update' element={<ProtectedRoute component={UpdateProfile} />} />
        <Route exact path='/password/update' element={<ProtectedRoute component={UpdatePassword} />} />
        <Route exact path='/password/forgot' element={<ForgotPassword />} />
        <Route exact path='/password/reset/:token' element={<ResetPassword />} />
        <Route exact path='/cart' element={<Cart />} />
        <Route exact path='/login/shipping' element={<ProtectedRoute component={Shipping} />} />
        <Route exact path='/order/confirm' element={<ProtectedRoute component={ConfirmOrder} />} />
        {stripeApiKey &&
          <Route exact path='/process/payment' element={<Elements stripe={loadStripe(stripeApiKey)}>
            <ProtectedRoute component={Payment} /> </Elements>} />
        }
        <Route exact path='/success' element={<ProtectedRoute component={OrderSuccess} />} />
        <Route exact path='/orders' element={<ProtectedRoute component={myOrders} />} />
        <Route exact path='/order/:id' element={<ProtectedRoute component={OrderDetails} />} />
        <Route  isAdmin={true} exact path='/admin/dashboard' element={<ProtectedRoute  component={Dashboard} />} />
        <Route  isAdmin={true} exact path='/admin/products' element={<ProtectedRoute  component={ProductList} />} />
        <Route  isAdmin={true} exact path='/admin/product' element={<ProtectedRoute  component={NewProduct} />} />
        <Route  isAdmin={true} exact path='/admin/product/:id' element={<ProtectedRoute  component={UpdateProduct} />} />
        <Route  isAdmin={true} exact path='/admin/orders' element={<ProtectedRoute  component={OrderList} />} />
      
        <Route isAdmin={true} exact path='/admin/order/:id' element={<ProtectedRoute  component={ProcessOrder} />} />
        <Route isAdmin={true} exact path='/admin/users' element={<ProtectedRoute  component={UsersList} />} />
        <Route isAdmin={true} exact path='/admin/user/:id' element={<ProtectedRoute  component={UpdateUser} />} />
        <Route isAdmin={true} exact path='/admin/reviews' element={<ProtectedRoute  component={ProductReviews} />} />
        <Route exact path='/about' element={<About />} />

        <Route path="*" element={<NotFound/>} />
      </Routes>


      <Footer />
    </BrowserRouter>
  )
}

export default App;
