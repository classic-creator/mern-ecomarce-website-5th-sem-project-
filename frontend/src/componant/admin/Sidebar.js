import React from 'react'
import "./sidebar.css"
import logo from "../../images/logo1.png"
import { TreeView,TreeItem } from '@material-ui/lab'
import { Link } from 'react-router-dom'
import { MdAdd, MdDashboard, MdExpandMore, MdImportExport, MdListAlt, MdPeople, MdPostAdd, MdRateReview } from 'react-icons/md'
const Sidebar = () => {
  return (
    <div className='sidebar'>
        <Link to="/">
            <img src={logo} alt="Ecomarce" />
        </Link>
        <Link to="/admin/dashboard">
            <p>
                <MdDashboard/>Dashboard
            </p>
        </Link>
        <Link>
        <TreeView defaultCollapseIcon={<MdExpandMore/>} 
        defaultExpandIcon={<MdImportExport/>}>
            <TreeItem nodeId="1" label="Products">
                <Link to="/admin/products">
                    <TreeItem nodeId='2' label="All" icon={<MdPostAdd/>}/>
                </Link>

                <Link to="/admin/product">
                    <TreeItem  nodeId='3' label="Create" icon={<MdAdd/>}/>
                </Link>


            </TreeItem>
        </TreeView>
        </Link>
        <Link to="/admin/orders">
            <p>
                <MdListAlt/>Orders
            </p>
        </Link>

        <Link to="/admin/users">
            <p>
                <MdPeople/> users
            </p>
        </Link>
        <Link to="/admin/reviews">
            <p>
                <MdRateReview/> Reviews
            </p>
        </Link>


    </div>
  )
}

export default Sidebar