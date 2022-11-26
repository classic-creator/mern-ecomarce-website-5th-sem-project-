import React ,{Fragment,useState}from 'react'
import "./header.css"
import {SpeedDial,SpeedDialAction} from "@material-ui/lab"
import { Backdrop } from '@material-ui/core'
import { MdDashboard ,MdPerson,MdExitToApp,MdListAlt, MdShoppingCart} from 'react-icons/md'
import {  useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { logout } from '../../../actions/userAction'
import { useDispatch ,useSelector} from 'react-redux'


const UserOptions = ({user}) => {
  const {cartItems}=useSelector(state=>state.cart)

  const dispatch=useDispatch()
  const navigate= useNavigate()
  const alert=useAlert()
  const[open,setOpen]=useState(false)

  const options= [
    {icon:<MdListAlt />,name: "Orders" , func:orders },
    {icon:<MdPerson/> , name:"Profile" , func:account},
    {icon:<MdShoppingCart style={{color:cartItems.length>0? "Tomato":"unset"}}/> ,name:`Cart(${cartItems.length}) `,func:cart },
    {icon:<MdExitToApp/>,name:"Logout",func:logoutUser}
  ];
if(user.role==="admin"){
  options.unshift({icon:<MdDashboard/>, name:"Dasbord" , func:dasbord})
}

function dasbord(){
  navigate("/admin/dashboard")
}
function orders(){
  navigate("/orders")
}
function account(){
  navigate("/account")
}
function cart(){
  navigate("/cart")
}
function logoutUser(){
  dispatch(logout())
   alert.success("Logout Successfully")
}

  return (
  
      <Fragment>
        <Backdrop open={open} style={{zIndex:10}}/>
    <SpeedDial
    className="speedDial"
    style={{zIndex:11}}
    ariaLabel="Speeddial tooltip example"
    onClose={()=>setOpen(false)}
    onOpen={()=>setOpen(true)} 
    open={open}
    direction="down"
    icon={<img className='speedDialIcon'
  src={user.avater.url ? user.avater.url : "/logo512.png"}
    alt="profile"
    />}
    >




   {options.map((item)=>(
    <SpeedDialAction icon={item.icon} key={item.name}  tooltipTitle={item.name} tooltipOpen={window.innerWidth<=600?true:false} onClick={item.func}/>
   ))} </SpeedDial>


      </Fragment>
  )
  
}

export default UserOptions