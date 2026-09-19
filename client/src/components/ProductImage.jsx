import React, { useState } from "react";
import { FaImage } from "react-icons/fa";
import getImageUrl from "../utils/imageUrl";

// Renders a product image. Falls back to a placeholder box only when
// there's genuinely no image to show (deleted product / missing file /
// failed load). When the product still has image data but is
// unavailable (hidden or out of stock), the real photo is still shown,
// just dimmed, so the item stays recognizable.
function ProductImage({ image, alt, unavailable, className = "" }) {

  const [broken, setBroken] = useState(false);

  const src = getImageUrl(image);

  if (!src || broken) {
    return (
      <div className={`product-image-placeholder ${className}`}>
        <FaImage />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${unavailable ? "product-image-dimmed" : ""}`}
      onError={() => setBroken(true)}
    />
  );
}

export default ProductImage;
