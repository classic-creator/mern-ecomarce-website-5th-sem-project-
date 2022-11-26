import React from 'react'
import { Fragment } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import {DataGrid} from "@material-ui/data-grid"
import {  MdDelete, MdEdit } from 'react-icons/md'
import { Button } from '@material-ui/core'
import MetaData from '../layout/MetaData'
import Sidebar from './Sidebar'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import "./productList.css"

import { getAllUsers ,clearErrors, deleteUser} from '../../actions/userAction'
import { DELETE_USER_RESET } from '../../constants/userConstants'


const UsersList = () => {

    const dispatch=useDispatch()
    const navigate=useNavigate()

    const alert=useAlert()


    const {error,users}=useSelector(state=>state.allUsers)
    const {error:deleteError,isDeleted,message}=useSelector(state=>state.profile)

    const deleteUserHandler=(id)=>{
      dispatch(deleteUser(id))
    }
    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors())
        }

        if(deleteError){
          alert.error(deleteError);
          dispatch(clearErrors())
      }
      if(isDeleted){
        alert.success(message)
        navigate("/admin/users")
        dispatch({type:DELETE_USER_RESET})
      }

        dispatch(getAllUsers())
    },[dispatch,navigate,error,alert,deleteError,isDeleted,message])


    const columns = [
        { field: "id", headerName: "User ID", minWidth: 200, flex: 0.5 },
    
        {
          field: "name",
          headerName: "Name",
          minWidth: 150,
          flex: 0.3,
        },
        {
          field: "email",
          headerName: "Email",
          type: "email",
          minWidth: 150,
          flex: 0.3,
        },
    
        {
          field: "role",
          headerName: "Rolee",
          type: "number",
          minWidth: 150,
          flex: 0.3,
          cellClassName:(params)=>{
            return params.getValue(params.id,"role")==="admin" ? "greenColor" : "redColor"
          }
        },
    
        {
          field: "actions",
          flex: 0.3,
          headerName: "Actions",
          minWidth: 150,
          type: "number",
          sortable: false,
          renderCell: (params) => {
            return (
              <Fragment>
                <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
                  <MdEdit />
                </Link>
    
                <Button
                  onClick={() =>
                    deleteUserHandler(params.getValue(params.id, "id"))
                  }
                >
                  < MdDelete/>
                </Button>
              </Fragment>
            );
          },
        },
      ];

const rows=[];

users && users.forEach((item)=>{
    rows.push({
        id:item._id,
        email:item.email,
        role:item.role,
        name:item.name
    })
})

  return (
   <Fragment>
    <MetaData title={`ALL USERS -- ADMIN`}/>
    <div className="dashboard">
        <Sidebar/>
        <div className="productListContainer">
            <h1 id='productListHeading'>All Users</h1>
            <DataGrid 
            rows={rows}
            columns={columns}
            pageSize={11}
           rowsPerPageOptions={[11]}
            disableSelectionOnClick
            className='productListTable'
    autoHeight
         
            />
        </div>
    </div>
   </Fragment>
  )
}



export default UsersList