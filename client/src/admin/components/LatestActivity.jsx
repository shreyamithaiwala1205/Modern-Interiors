import { ShoppingBag } from "lucide-react";
import "./../css/LatestActivity.css";

const LatestActivity = ({ dashboard }) => {

  return (

    <div className="latest-activity">

      <div className="activity-header">

        <div>

          <h2>Latest Activity</h2>

          <p>Recent customer orders</p>

        </div>

      </div>

      <div className="activity-list">

        {dashboard?.recentOrders?.length > 0 ? (

          dashboard.recentOrders.map((order) => (

            <div
              key={order._id}
              className="activity-card"
            >

              <div className="activity-left">

                <div className="activity-icon">

                  <ShoppingBag size={20} />

                </div>

                <div>

                  <h4>{order.user?.name}</h4>

                  <p>

                    Ordered #{order.orderNumber}

                  </p>

                </div>

              </div>

              <div className="activity-right">

                <span>

                  ₹{order.totalPrice.toLocaleString()}

                </span>

              </div>

            </div>

          ))

        ) : (

          <div className="empty-activity">

            No Recent Activity

          </div>

        )}

      </div>

    </div>

  );

};

export default LatestActivity;