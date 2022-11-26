import React, { Fragment, useState, useEffect } from "react";
import "./updatePassword.css";
import Loader from "../layout/loader/loader";
import { MdLock, MdLockOpen, MdVpnKey} from 'react-icons/md'
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updatePassword} from "../../actions/userAction";
import { useAlert } from "react-alert";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import MetaData from "../layout/MetaData";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
 
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate=useNavigate()
  
    
    const { error, isUpdated, loading } = useSelector((state) => state.profile);
  
   const [oldPassword, setOldPassword] = useState("")
   const [newPassword, setNewPassword] = useState("")
   const [confirmPassword, setConfirmPassword] = useState("")
  
    const updatePasswordSubmit = (e) => {
      e.preventDefault();
  
      const myForm = new FormData();
  
      myForm.set("oldPassword", oldPassword);
      myForm.set("newPassword", newPassword);
      myForm.set("confirmPassword", confirmPassword);
      dispatch(updatePassword(myForm));
  
    }
  
    useEffect(() => {
  
  
      if (error) {
        alert.error(error);
        dispatch(clearErrors());
      }
  
      if (isUpdated) {
        alert.success("Profile Updated Successfully");
        
  
        navigate("/account");
  
        dispatch({
          type: UPDATE_PASSWORD_RESET,
        });
      }
    }, [dispatch, error, alert, navigate, isUpdated]);

 
 
 
 
    return  (
    <Fragment>
    {loading ? (
      <Loader />
    ) : (
      <Fragment>
        <MetaData title="Update Password" />
        <div className="updatePasswordContainer">
          <div className="updatePasswordBox">
            <h2 className="updatePasswordHeading">Update Profile</h2>

            <form
              className="updatePasswordForm"
              encType="multipart/form-data"
              onSubmit={updatePasswordSubmit}
            >
            
             

            <div className="loginPassword">
                <MdLockOpen />
                <input type="password"
                    placeholder='old password'
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />
            </div>

            <div className="loginPassword">
                <MdLock />
                <input type="password"
                    placeholder='new password'
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>
            <div className="loginPassword">
                <MdVpnKey />
                <input type="password"
                    placeholder='confirm password'
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            
              
              <input
                type="submit"
                value="Change"
                className="updatePasswordBtn"
              />
            </form>
          </div>
        </div>
      </Fragment>
    )}
  </Fragment>

  );
    
}
export default UpdatePassword