export function rememberRecentlyViewed(product) {
  const existing = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
  const withoutCurrent = existing.filter((item) => item._id !== product._id);
  localStorage.setItem(
    "recentlyViewed",
    JSON.stringify([product, ...withoutCurrent].slice(0, 8))
  );
}

export default function RecentlyViewed() {
  const items = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
  if (!items.length) return null;

  return (
    <section className="recently-viewed">
      <h2>Recently Viewed</h2>
      <div className="product-row">
        {items.map((item) => (
          <a key={item._id} href={`/furniture/${item._id}`} className="mini-product-card">
            <img src={item.image} alt={item.name} />
            <span>{item.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
