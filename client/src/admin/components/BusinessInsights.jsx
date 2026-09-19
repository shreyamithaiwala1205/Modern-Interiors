import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

export default function BusinessInsights() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/admin/analytics/summary", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading insights...</p>;

  const chartData = {
    labels: data.statusDistribution.map((x) => x._id),
    datasets: [{ data: data.statusDistribution.map((x) => x.count) }],
  };

  return (
    <section>
      <h2>Business Insights</h2>
      <div className="kpi-grid">
        <article><span>Total Revenue</span><strong>₹{data.totalRevenue.toLocaleString("en-IN")}</strong></article>
        <article><span>Paid Orders</span><strong>{data.paidOrders}</strong></article>
        <article><span>Average Order Value</span><strong>₹{data.averageOrderValue.toLocaleString("en-IN")}</strong></article>
        <article><span>Low Stock Items</span><strong>{data.lowStock.length}</strong></article>
      </div>
      <div className="dashboard-grid">
        <div><h3>Order Status</h3><Doughnut data={chartData} /></div>
        <div><h3>Low Stock</h3>{data.lowStock.map((p) => <p key={p._id}>{p.name}: {p.stock} left</p>)}</div>
        <div><h3>Top Products</h3>{data.topProducts.map((p) => <p key={p._id}>{p.name}: {p.unitsSold} sold</p>)}</div>
      </div>
    </section>
  );
}
