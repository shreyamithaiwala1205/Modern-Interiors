import { Link, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../css/PaymentSuccess.css";

function PaymentSuccess() {
    const location = useLocation();
    const order = location.state?.order;
    
    const downloadInvoice = () => {

    if (!order) return;

    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);

    doc.text("MODERN INTERIORS", 14, 20);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const invoiceNo = `INV-${Math.floor(100000 + Math.random() * 900000)}`;

    doc.line(14, 34, 195, 34);

    doc.text(`Invoice : INV-${Date.now()}`, 14, 45);

    new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    doc.text(`Customer : ${order.customerName}`, 14, 61);

    autoTable(doc, {

        startY: 72,

        head: [["Product", "Qty", "Price"]],

        body: order.items.map((item) => [

        item.furniture.name,

        item.quantity,

        `Rs. ${(
            item.furniture.priceValue *
            item.quantity
        ).toLocaleString()}`,

        ]),

        theme: "grid",

        headStyles: {

        fillColor: [212,175,55],

        textColor: 0,

        },

    });

    let y = doc.lastAutoTable.finalY + 15;

    doc.setFont("helvetica", "bold");

    doc.text(
        `Subtotal : Rs. ${order.subtotal.toLocaleString()}`,
        14,
        y
    );

    y += 10;

    doc.text(
        `Discount : Rs. ${order.discount.toLocaleString()}`,
        14,
        y
    );

    y += 10;

    doc.text(
        `Delivery : FREE`,
        14,
        y
    );

    y += 10;

    doc.setFontSize(14);

    doc.text(
        `Grand Total : Rs. ${order.total.toLocaleString()}`,
        14,
        y
    );

    y += 15;

    doc.setFontSize(11);

    doc.text(
        `Payment ID : ${order.paymentId}`,
        14,
        y
    );

    y += 12;

    doc.setTextColor(0,120,0);

    doc.text("✓ Payment Status : PAID", 14, y);

    y += 20;

    doc.setTextColor(0);

    doc.setFontSize(13);

    doc.text(
        "Thank You For Shopping!",
        14,
        y
    );

    doc.save("ModernInteriors-Invoice.pdf");

    };

    return (
        <section className="success-page">

        <div className="success-card">

            <div className="checkmark">
            ✓
            </div>

            <h1>Payment Successful</h1>

            <p>
            Thank you for shopping with Modern Interiors.
            </p>

            <p>
            Your order has been placed successfully.
            </p>

            <Link
            to="/orders"
            className="success-btn"
            >
            View My Orders
            </Link>

            <button
            className="invoice-btn"
            onClick={downloadInvoice}
            >
            Download Invoice
            </button>

        </div>

        </section>
    );
}

export default PaymentSuccess;