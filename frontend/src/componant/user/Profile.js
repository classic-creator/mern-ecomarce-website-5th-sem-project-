import React, { Fragment } from 'react'
import MetaData from '../layout/MetaData'
import Loader from '../layout/loader/loader'
import { Link,  useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import "./Profile.css"


const Profile = () => {

    const navigate=useNavigate()
    const {user, loading,isAuthenticated}=useSelector(state=>state.user)

    useEffect(()=>{
        
        if(isAuthenticated===false){
            navigate("/login")
        }
    },[navigate,isAuthenticated])

  return (
    <Fragment>
        {loading ? (<Loader/>):(
            <Fragment>
        <MetaData title={`${user.name}'s Profile`}/>
        <div className='profileContainer'>
            <div>
                <h1>MY PROFILE</h1>
                <img src={user.avater.url} alt={user.name} />
                <Link to="/me/update">Edit Profile</Link>
            </div>
            <div>
                <div>
                    <h4>Full Name</h4>
                    <p>{user.name}</p>
                </div>
                <div>
                    <h4>Email</h4>
                    <p>{user.email}</p>
                </div>
                <div>
                    <h4>Joined On</h4>
                    <p>{String(user.createdAt).substr(0,10)}</p>
                </div>
                <div>
                    <Link to="/orders">My orders</Link>
                    <Link to="/password/update">Change password</Link>
                </div>
            </div>
        

        </div>
    </Fragment>
        )}
    </Fragment>
  )
}

export default Profile