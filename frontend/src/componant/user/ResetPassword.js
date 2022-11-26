import React, { Fragment, useState, useEffect } from "react";
import "./ResetPassword.css";
import Loader from "../layout/loader/loader";
import { MdLock,  MdVpnKey} from 'react-icons/md'
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, resetPassword} from "../../actions/userAction";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate=useNavigate()
  const {token} =useParams()
  
  const { error, success, loading } = useSelector((state) => state.forgotPassword);

 
 const [password, setPassword] = useState("")
 const [confirmPassword, setConfirmPassword] = useState("")

  const resetPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();


    myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);
    dispatch(resetPassword(token,myForm));

  }

  useEffect(() => {


    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Password Updated Successfully");
      

      navigate("/login");

    
    }
  }, [dispatch, error, alert, navigate, success]);





  return  (
  <Fragment>
  {loading ? (
    <Loader />
  ) : (
    <Fragment>
      <MetaData title="Update Password" />
      <div className="resetPasswordContainer">
        <div className="resetPasswordBox">
          <h2 className="resetPasswordHeading">Update Profile</h2>

          <form
            className="resetPasswordForm"
            encType="multipart/form-data"
            onSubmit={resetPasswordSubmit}
          >
          
          <div >
              <MdLock />
              <input type="password"
                  placeholder='new password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
          </div>
          <div>
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
              className="resetPasswordBtn"
            />
          </form>
        </div>
      </div>
    </Fragment>
  )}
</Fragment>

);
}

export default ResetPassword