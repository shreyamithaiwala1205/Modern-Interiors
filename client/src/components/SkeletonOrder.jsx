import "../css/Skeleton.css";

function SkeletonOrder() {
  return (
    <div className="skeleton-card">

      <div className="skeleton skeleton-title"></div>

      <div className="skeleton skeleton-status"></div>

      <div className="skeleton-item">

        <div className="skeleton skeleton-image"></div>

        <div className="skeleton-content">

          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text short"></div>
          <div className="skeleton skeleton-text"></div>

        </div>

      </div>

      <div className="skeleton skeleton-footer"></div>

    </div>
  );
}

export default SkeletonOrder;