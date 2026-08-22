import "../css/LowStockProducts.css";

import {
  AlertTriangle,
  CircleCheckBig,
} from "lucide-react";

const LowStockProducts = ({ dashboard }) => {

  const lowStock = dashboard?.lowStockProducts || [];

  return (

    <div className="low-stock">

      <div className="low-stock-header">

        <div>

          <h2>Low Stock Products</h2>

          <p>Products that need restocking</p>

        </div>

      </div>

      {lowStock.length > 0 ? (

        lowStock.map((product) => (

          <div
            key={product._id}
            className="stock-card"
          >

            <div className="stock-left">

              <div className="stock-icon">

                <AlertTriangle size={22} />

              </div>

              <div>

                <h4>{product.name}</h4>

                <p>
                  Only {product.stock} item(s) left
                </p>

              </div>

            </div>

            <span className="stock-warning">
              LOW
            </span>

          </div>

        ))

      ) : (

        <div className="stock-empty">

          <CircleCheckBig size={55} />

          <h3>Everything looks good!</h3>

          <p>No products are running low.</p>

        </div>

      )}

    </div>

  );

};

export default LowStockProducts;