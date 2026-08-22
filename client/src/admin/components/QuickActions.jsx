import { Link } from "react-router-dom";

import {
  Users,
  Sofa,
  ShoppingBag,
  PlusCircle,
} from "lucide-react";

import "../css/QuickActions.css";

const QuickActions = () => {

  return (

    <div className="quick-actions">

      <h2>Quick Actions</h2>

      <div className="quick-grid">

        <Link
          to="/admin/users"
          className="quick-card"
        >
          <Users size={35} />
          <span>Manage Users</span>
        </Link>

        <Link
          to="/admin/products"
          className="quick-card"
        >
          <Sofa size={35} />
          <span>Products</span>
        </Link>

        <Link
          to="/admin/orders"
          className="quick-card"
        >
          <ShoppingBag size={35} />
          <span>Orders</span>
        </Link>

        <Link
          to="/admin/add-product"
          className="quick-card"
        >
          <PlusCircle size={35} />
          <span>Add Product</span>
        </Link>

      </div>

    </div>

  );

};

export default QuickActions;