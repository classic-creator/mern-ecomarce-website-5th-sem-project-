import React, { useEffect } from 'react'
import Sidebar from "./Sidebar.js"
import "./dashboard.css"
import { Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { Doughnut, Line } from "react-chartjs-2"
import { Chart as ChartJS, registerables } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux'
import { getAdminProduct } from '../../actions/productAction.js'
import { getAllOrders } from '../../actions/orderAction.js'
import { getAllUsers } from '../../actions/userAction.js'
// import { Chart } from 'react-chartjs-2'


const Dashboard = () => {
  ChartJS.register(...registerables);
  const dispatch = useDispatch()

  const {orders} = useSelector(state=>state.allorders)
  const { products } = useSelector(state => state.products)
  const {users}=useSelector(state=>state.allUsers)



  let outofStock = 0
  products && products.forEach((item) => {
    if (item.stock === 0) {
      outofStock += 1
    }
  })

  useEffect(() => {
    dispatch(getAdminProduct())
    dispatch(getAllOrders())
    dispatch(getAllUsers())


  }, [dispatch])

  let totalAmount=0

  orders && orders.forEach((item)=>{
    totalAmount += item.totalPrice
  })

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["Tomato"],
        hoverBackgroundColor: ["rgb(192,72,49)"],
        data: [0, totalAmount]

      }
    ]
  }

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {

        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outofStock, products.length - outofStock]

      }
    ]
  }

  return (
    <div className='dashboard'>
      <Sidebar />
      <div className='dashboardContainer'>
        <Typography component="h1">Dashboard</Typography>
        <div className='dashboardSummery'>
          <div>
            <p className='dashboardSummeryP'>
              Total Amount <br /> ₹{totalAmount}
            </p>

          </div>
          <div className="dashboardSummeryBox2">
            <Link to="/admin/products">
              <p>Products</p>
              <p>{products && products.length}</p>
            </Link>

            <Link to="/admin/orders">
              <p>Orders</p>
              <p>{orders && orders.length}</p>
            </Link>


            <Link to="/admin/users">
              <p>Users</p>
              <p>{users && users.length}</p>
            </Link>
          </div>

        </div>

        <div className="lineChart">
          <Line data={lineState} />
        </div>
        <div className="doughnutChat">
          <Doughnut
            data={doughnutState} />
        </div>

      </div>
    </div>
  )
}

export default Dashboard