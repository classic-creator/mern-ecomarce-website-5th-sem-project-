import React, { Fragment, useRef, useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import "./loginSingUp.css"
import { MdFace, MdLockOpen, MdMailOutline } from 'react-icons/md'
import {useDispatch,useSelector} from "react-redux"
import {useAlert} from "react-alert"
import {clearErrors ,login,register} from "../../actions/userAction"
import Loader from "../layout/loader/loader"
import { useNavigate,useLocation} from "react-router-dom"

const LoginSingUp = () => {


    const location=useLocation()
    const dispatch=useDispatch()
    const alert=useAlert()
    const navigate=useNavigate()

    const {error,loading,isAuthenticated} = useSelector(state=> state.user)

    const loginTab = useRef(null)
    const registerTab = useRef(null)
    const switcherTab = useRef(null)

    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    })
    const { name, email, password } = user;

    const [avater, setAvater] = useState("/logo192.png")
    const [avaterPreview, setAvaterPreview] = useState("/logo192.png")




    const loginSubmit = (e) => {
        e.preventDefault()
       dispatch(login(loginEmail,loginPassword))
    }

    const registerSubmit = (e) => {
        e.preventDefault()

        const myForm = new FormData()

        myForm.set("name", name)
        myForm.set("email", email)
        myForm.set("password", password)
        myForm.set("avater", avater)
        dispatch(register(myForm))
    }


    const registerDataChange = (e) => {
        if (e.target.name === "avater") {
            const reader = new FileReader()

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvaterPreview(reader.result);
                    setAvater(reader.result)
                }
            }
            reader.readAsDataURL(e.target.files[0])

        }
        else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }

    const redirect=location.search ? location.search.split("=")[1] : "/account";

    useEffect(() => {
     if(error){
        alert.error(error)
        dispatch(clearErrors())
     }
     if(isAuthenticated){
        navigate(redirect)
     }
    }, [dispatch,error,alert,isAuthenticated,navigate,redirect])
    

    const switchTabs = (e, tab) => {

        if (tab === "login") {
            switcherTab.current.classList.add("shiftToNeutral");
            switcherTab.current.classList.remove("shiftToRight");

            registerTab.current.classList.remove("shiftToNeutralForm");
            loginTab.current.classList.remove("shiftToLeft");
        }
        if (tab === "register") {
            switcherTab.current.classList.add("shiftToRight");
            switcherTab.current.classList.remove("shiftToNeutral");

            registerTab.current.classList.add("shiftToNeutralForm");
            loginTab.current.classList.add("shiftToLeft");
        }
    }

    return (
      <Fragment>
        {loading ? (<Loader/>) : (

<Fragment>
<div className="LoginSignUpContainer">
    <div className="LoginSignUpBox">
        <div>
            <div className="login_signUp_toggle">
                <p onClick={(e) => switchTabs(e, "login")} >LOGIN</p>
                <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
            </div>
            <button ref={switcherTab}></button>
        </div>
        <form className='loginForm' ref={loginTab} onSubmit={loginSubmit}>
            <div className="loginEmail">
                <MdMailOutline />

                <input type="email"
                    placeholder='Email'
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                />
            </div>
            <div className="loginPassword">
                <MdLockOpen />
                <input type="password"
                    placeholder='password'
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                />
            </div>
            <Link to="/password/forgot">Forgot Password ?</Link>
            <input type="submit" value="Login" className="loginBtn" />
        </form>
        <form
            className="signUpForm"
            ref={registerTab}
            encType="multipart/form-data"
            onSubmit={registerSubmit}
        >

            <div className="signUpName">
                <MdFace />
                <input type="text"
                    placeholder='Name'
                    required
                    name='name'
                    value={name}
                    onChange={registerDataChange} />

            </div>
            <div className="signUpEmail">
                <MdMailOutline />
                <input type="email"
                    placeholder='email'
                    required
                    name='email'
                    value={email}
                    onChange={registerDataChange}
                />
            </div>
            <div className="signUpPassword">
                <MdLockOpen />
                <input type="password"
                    placeholder='password'
                    required
                    name='password'
                    value={password}
                    onChange={registerDataChange}
                />
            </div>
            <div id="registerImage">
                <img src={avaterPreview} alt="Avater Preview" />
                <input type="file"
                    name='avater'
                    accept='image/*'
                    onChange={registerDataChange}
                />
            </div>
            <input
                type="submit"
                value="Register"
                className="signUpBtn"

            />
        </form>
    </div>
</div>
</Fragment>
        )}
      </Fragment>
    )
}

export default LoginSingUp