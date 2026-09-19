import "../css/LowStockProducts.css";

import {
  PackageX,
  CircleCheckBig,
} from "lucide-react";

const OutOfStockProducts = ({ dashboard }) => {

  const outOfStock =
    dashboard?.outOfStockProducts || [];

  const outOfStockCount =
    dashboard?.outOfStockCount || 0;

  return (

    <div className="low-stock">

      <div className="low-stock-header">

        <div>

          <h2>Out of Stock Products</h2>

          <p>
            Automatically hidden from the
            storefront until restocked
          </p>

        </div>

        {outOfStockCount > 0 && (

          <span className="stock-warning out">
            {outOfStockCount} HIDDEN
          </span>

        )}

      </div>

      {outOfStock.length > 0 ? (

        outOfStock.map((product) => (

          <div
            key={product._id}
            className="stock-card"
          >

            <div className="stock-left">

              <div className="stock-icon out">

                <PackageX size={22} />

              </div>

              <div>

                <h4>{product.name}</h4>

                <p>
                  {product.autoHiddenDueToStock
                    ? "Auto-hidden — 0 in stock"
                    : "0 in stock"}
                </p>

              </div>

            </div>

            <span className="stock-warning out">
              OUT OF STOCK
            </span>

          </div>

        ))

      ) : (

        <div className="stock-empty">

          <CircleCheckBig size={55} />

          <h3>Everything is in stock!</h3>

          <p>No products are currently out of stock.</p>

        </div>

      )}

    </div>

  );

};

export default OutOfStockProducts;
