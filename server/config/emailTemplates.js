const BRAND_NAME = "Modern Interiors";
const BRAND_GOLD = "#d4af37";
const BRAND_DARK = "#111111";

const STATUS_COPY = {
    Pending: {
        color: "#f59e0b",
        title: "Order Received",
        message:
            "We've received your order and it's being reviewed by our team.",
    },
    Confirmed: {
        color: "#38bdf8",
        title: "Order Confirmed",
        message:
            "Great news! Your order has been confirmed and is being prepared.",
    },
    Processing: {
        color: "#3b82f6",
        title: "Order Processing",
        message:
            "Your order is now being processed by our team.",
    },
    Shipped: {
        color: "#8b5cf6",
        title: "Order Shipped",
        message:
            "Your order is on its way to you.",
    },
    "Out for Delivery": {
        color: "#8b5cf6",
        title: "Out For Delivery",
        message:
            "Your order is out for delivery and will reach you soon.",
    },
    Delivered: {
        color: "#22c55e",
        title: "Order Delivered",
        message:
            "Your order has been delivered. We hope you love it!",
    },
    Cancelled: {
        color: "#ef4444",
        title: "Order Cancelled",
        message:
            "Your order has been cancelled. If this wasn't expected, please contact us.",
    },
};

const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );
};

// =====================================================
// SHARED LAYOUT
// =====================================================

const emailLayout = ({
    preheader = "",
    accentColor = BRAND_GOLD,
    heading,
    subheading,
    bodyHtml,
}) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${BRAND_NAME}</title>
</head>
<body style="margin:0; padding:0; background:#f4f2ec; font-family:Arial, Helvetica, sans-serif;">

  <span style="display:none; max-height:0; overflow:hidden;">${preheader}</span>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ec; padding:32px 0;">
    <tr>
      <td align="center">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:92%; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="background:${BRAND_DARK}; padding:28px 36px; text-align:center;">
              <div style="color:${BRAND_GOLD}; font-size:22px; font-weight:bold; letter-spacing:1px;">
                ${BRAND_NAME}
              </div>
              <div style="color:#999999; font-size:11px; letter-spacing:2px; text-transform:uppercase; margin-top:4px;">
                Luxury Interiors &amp; Furniture
              </div>
            </td>
          </tr>

          <!-- ACCENT STRIP -->
          <tr>
            <td style="height:4px; background:${accentColor};"></td>
          </tr>

          <!-- HEADING -->
          <tr>
            <td style="padding:32px 36px 8px;">
              <h1 style="margin:0; font-size:22px; color:#1a1a1a;">
                ${heading}
              </h1>
              ${
                  subheading
                      ? `<p style="margin:8px 0 0; color:#777777; font-size:14px; line-height:1.6;">${subheading}</p>`
                      : ""
              }
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:16px 36px 36px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f7f5ef; padding:24px 36px; text-align:center; border-top:1px solid #ececec;">
              <p style="margin:0; color:#999999; font-size:12px; line-height:1.7;">
                ${BRAND_NAME} &middot; Crafted interiors, delivered with care.<br />
                This is an automated message, please do not reply directly to this email.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

// =====================================================
// ORDER ITEMS TABLE (shared partial)
// =====================================================

const itemsTable = (items = []) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin:20px 0;">
    <thead>
      <tr>
        <td style="padding:10px 0; border-bottom:2px solid #eeeeee; color:#999999; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Item</td>
        <td style="padding:10px 0; border-bottom:2px solid #eeeeee; color:#999999; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; text-align:center;">Qty</td>
        <td style="padding:10px 0; border-bottom:2px solid #eeeeee; color:#999999; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; text-align:right;">Price</td>
      </tr>
    </thead>
    <tbody>
      ${items
          .map(
              (item) => `
      <tr>
        <td style="padding:12px 0; border-bottom:1px solid #f2f2f2; color:#1a1a1a; font-size:14px;">${item.name}</td>
        <td style="padding:12px 0; border-bottom:1px solid #f2f2f2; color:#555555; font-size:14px; text-align:center;">${item.quantity}</td>
        <td style="padding:12px 0; border-bottom:1px solid #f2f2f2; color:#1a1a1a; font-size:14px; text-align:right;">${formatCurrency(
            item.price * item.quantity
        )}</td>
      </tr>`
          )
          .join("")}
    </tbody>
  </table>
`;

// =====================================================
// ORDER CONFIRMATION (CUSTOMER)
// =====================================================

const orderConfirmationEmail = ({
    order,
    items,
}) => {

    const html = emailLayout({
        preheader: `Your order ${order.orderNumber} has been placed successfully.`,
        accentColor: BRAND_GOLD,
        heading: `Thank you, ${order.shippingAddress.fullName.split(" ")[0]}!`,
        subheading: `Your order <strong>#${order.orderNumber}</strong> has been placed successfully and is now being reviewed by our team.`,
        bodyHtml: `

          ${itemsTable(items)}

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
            <tr>
              <td style="padding:6px 0; color:#777777; font-size:13.5px;">Subtotal</td>
              <td style="padding:6px 0; color:#1a1a1a; font-size:13.5px; text-align:right;">${formatCurrency(
                  order.subtotal
              )}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; color:#777777; font-size:13.5px;">Delivery</td>
              <td style="padding:6px 0; color:#1a1a1a; font-size:13.5px; text-align:right;">${
                  order.deliveryCharge
                      ? formatCurrency(order.deliveryCharge)
                      : "Free"
              }</td>
            </tr>
            ${
                order.discount
                    ? `<tr>
              <td style="padding:6px 0; color:#777777; font-size:13.5px;">Discount</td>
              <td style="padding:6px 0; color:#16a34a; font-size:13.5px; text-align:right;">-${formatCurrency(
                  order.discount
              )}</td>
            </tr>`
                    : ""
            }
            <tr>
              <td style="padding:14px 0 0; color:#1a1a1a; font-size:16px; font-weight:bold; border-top:2px solid #eeeeee;">Total</td>
              <td style="padding:14px 0 0; color:${BRAND_GOLD}; font-size:18px; font-weight:bold; text-align:right; border-top:2px solid #eeeeee;">${formatCurrency(
                  order.totalPrice
              )}</td>
            </tr>
          </table>

          <div style="margin-top:28px; padding:18px 20px; background:#f7f5ef; border-radius:10px;">
            <p style="margin:0 0 6px; color:#999999; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Shipping To</p>
            <p style="margin:0; color:#1a1a1a; font-size:14px; line-height:1.7;">
              ${order.shippingAddress.fullName}<br />
              ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br />
              Phone: ${order.shippingAddress.phone}
            </p>
          </div>

          <p style="margin-top:26px; color:#777777; font-size:13.5px; line-height:1.7;">
            We'll email you again as soon as your order is confirmed and dispatched. You can also track your order anytime from your account.
          </p>
        `,
    });

    return {
        subject: `Order Confirmed - #${order.orderNumber} | ${BRAND_NAME}`,
        html,
    };

};

// =====================================================
// ORDER STATUS UPDATE (CUSTOMER)
// =====================================================

const orderStatusUpdateEmail = ({ order }) => {

    const status =
        STATUS_COPY[order.status] ||
        STATUS_COPY.Pending;

    const items = (order.items || []).map(
        (item) => ({
            name:
                item.furniture?.name ||
                "Product",
            quantity: item.quantity,
            price: item.price,
        })
    );

    const html = emailLayout({
        preheader: `Your order ${order.orderNumber} is now ${order.status}.`,
        accentColor: status.color,
        heading: status.title,
        subheading: `${status.message}`,
        bodyHtml: `

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            <tr>
              <td style="padding:14px 18px; background:#f7f5ef; border-radius:10px; color:#1a1a1a; font-size:14px;">
                Order <strong>#${order.orderNumber}</strong> &middot; Placed on ${formatDate(
                    order.createdAt
                )}
              </td>
            </tr>
          </table>

          ${itemsTable(items)}

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
            <tr>
              <td style="padding:14px 0 0; color:#1a1a1a; font-size:16px; font-weight:bold; border-top:2px solid #eeeeee;">Total</td>
              <td style="padding:14px 0 0; color:${BRAND_GOLD}; font-size:18px; font-weight:bold; text-align:right; border-top:2px solid #eeeeee;">${formatCurrency(
                  order.totalPrice
              )}</td>
            </tr>
          </table>

          <p style="margin-top:26px; color:#777777; font-size:13.5px; line-height:1.7;">
            Current status: <strong style="color:${status.color};">${order.status}</strong>. You can check full order details anytime from your account's Orders page.
          </p>
        `,
    });

    return {
        subject: `${status.title} - #${order.orderNumber} | ${BRAND_NAME}`,
        html,
    };

};

// =====================================================
// ADMIN NOTIFICATION (ORDER CONFIRMED)
// =====================================================

const adminOrderConfirmedEmail = ({ order }) => {

    const items = (order.items || []).map(
        (item) => ({
            name:
                item.furniture?.name ||
                "Product",
            quantity: item.quantity,
            price: item.price,
        })
    );

    const html = emailLayout({
        preheader: `Order ${order.orderNumber} has been confirmed.`,
        accentColor: "#38bdf8",
        heading: "Order Confirmed",
        subheading: `Order <strong>#${order.orderNumber}</strong> has just been marked as Confirmed.`,
        bodyHtml: `

          <div style="margin-bottom:22px; padding:18px 20px; background:#f7f5ef; border-radius:10px;">
            <p style="margin:0 0 6px; color:#999999; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Customer</p>
            <p style="margin:0; color:#1a1a1a; font-size:14px; line-height:1.7;">
              ${order.shippingAddress.fullName}<br />
              ${order.shippingAddress.email}<br />
              ${order.shippingAddress.phone}
            </p>
          </div>

          ${itemsTable(items)}

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
            <tr>
              <td style="padding:14px 0 0; color:#1a1a1a; font-size:16px; font-weight:bold; border-top:2px solid #eeeeee;">Total</td>
              <td style="padding:14px 0 0; color:${BRAND_GOLD}; font-size:18px; font-weight:bold; text-align:right; border-top:2px solid #eeeeee;">${formatCurrency(
                  order.totalPrice
              )}</td>
            </tr>
          </table>

          <div style="margin-top:22px; padding:18px 20px; background:#f7f5ef; border-radius:10px;">
            <p style="margin:0 0 6px; color:#999999; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Shipping Address</p>
            <p style="margin:0; color:#1a1a1a; font-size:14px; line-height:1.7;">
              ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}
            </p>
          </div>
        `,
    });

    return {
        subject: `[Admin] Order Confirmed - #${order.orderNumber}`,
        html,
    };

};

module.exports = {
    orderConfirmationEmail,
    orderStatusUpdateEmail,
    adminOrderConfirmedEmail,
};
