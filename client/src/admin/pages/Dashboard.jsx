import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUsers,
  FaShoppingBag,
  FaCouch,
  FaRupeeSign,
} from "react-icons/fa";
import AdminLayout from "../AdminLayout";
import RevenueChart from "../components/RevenueChart";
import QuickActions from "../components/QuickActions";
import LatestActivity from "../components/LatestActivity";
import LowStockProducts from "../components/LowStockProducts";
import "../css/Dashboard.css";

const Dashboard = () => {

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard = async () => {

    try {

      const token = localStorage.getItem("token");

      const { data } = await axios.get(

        "http://localhost:5000/api/admin/dashboard",

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );

      setDashboard(data.dashboard);

    }

    catch (error) {

      console.log(error);

      setError("Failed to load dashboard.");

    }

    finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <AdminLayout>

        <h2>Loading Dashboard...</h2>

      </AdminLayout>

    );

  }

  if (error) {

    return (

      <AdminLayout>

        <h2>{error}</h2>

      </AdminLayout>

    );

  }

  return (

    <AdminLayout>

        <div className="dashboard">

        <h1 className="dashboard-title">

            Admin Dashboard

        </h1>

        <div className="dashboard-cards">

        <div className="dashboard-card">

            <div className="card-icon users-icon">
            <FaUsers size={32} />
            </div>

            <div>

            <h3>Total Users</h3>

            <h2>{dashboard?.totalUsers}</h2>

            </div>

        </div>

        <div className="dashboard-card">

            <div className="card-icon products-icon">
            <FaCouch size={32} />
            </div>

            <div>

            <h3>Total Products</h3>

            <h2>{dashboard?.totalProducts}</h2>

            </div>

        </div>

        <div className="dashboard-card">

            <div className="card-icon orders-icon">
            <FaShoppingBag size={32} />
            </div>

            <div>

            <h3>Total Orders</h3>

            <h2>{dashboard?.totalOrders}</h2>

            </div>

        </div>

        <div className="dashboard-card">

            <div className="card-icon revenue-icon">
            <FaRupeeSign size={32} />
            </div>

            <div>

            <h3>Total Revenue</h3>

            <h2>

                ₹{dashboard?.totalRevenue?.toLocaleString()}

            </h2>

            </div>

        </div>

        </div>

        <RevenueChart />

        <LowStockProducts dashboard={dashboard} />

        <LatestActivity dashboard={dashboard} />

        <QuickActions />

        <div className="recent-orders">

            <h2>Recent Orders</h2>

            <table>

            <thead>

                <tr>

                <th>Order No.</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Status</th>

                </tr>

            </thead>

            <tbody>

                {dashboard?.recentOrders?.length > 0 ? (

                dashboard.recentOrders.map((order) => (

                    <tr key={order._id}>

                    <td>{order.orderNumber}</td>

                    <td>{order.user?.name}</td>

                    <td>{order.user?.email}</td>

                    <td>₹{order.totalPrice.toLocaleString()}</td>

                    <td>

                        <span
                        className={`status ${order.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                        {order.status}
                        </span>

                    </td>

                    </tr>

                ))

                ) : (

                <tr>

                    <td colSpan="5">

                    No Recent Orders

                    </td>

                </tr>

                )}

            </tbody>

            </table>

        </div>
        </div>

    </AdminLayout>

    );

};

export default Dashboard;