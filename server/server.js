const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dns = require("dns");
const path = require("path");

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const furnitureRoutes = require("./routes/furnitureRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const couponRoutes = require("./routes/couponRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const contactRoutes = require("./routes/contactRoutes");
const projectRoutes = require("./routes/projectRoutes");
const statsRoutes = require("./routes/statsRoutes");

const adminRoutes = require("./routes/adminRoutes");
const adminProductRoutes = require("./routes/adminProductRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const adminCouponRoutes = require("./routes/adminCouponRoutes");
const adminConsultationRoutes = require("./routes/adminConsultationRoutes");
const adminContactRoutes = require("./routes/adminContactRoutes");
const adminProjectRoutes = require("./routes/adminProjectRoutes");

const app = express();

// =====================================================
// CORS
// =====================================================

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// =====================================================
// JSON
// =====================================================

app.use(
    express.json({
        limit: "10mb",
    })
);

// =====================================================
// URL ENCODED DATA
// =====================================================

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb",
    })
);

// =====================================================
// STATIC UPLOADS
// =====================================================

// Actual folder:
// D:\modern-interiors\server\uploads

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

// =====================================================
// IMAGES ALIAS
// =====================================================

// Frontend currently requests:
// http://localhost:5000/images/filename.png
//
// But actual files are inside:
// D:\modern-interiors\server\uploads
//
// Therefore /images will also point to uploads folder.

app.use(
    "/images",
    express.static(
        path.join(__dirname, "uploads")
    )
);

// =====================================================
// ROUTES
// =====================================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/furniture",
    furnitureRoutes
);

app.use(
    "/api/wishlist",
    wishlistRoutes
);

app.use(
    "/api/cart",
    cartRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);

app.use(
    "/api/payment",
    paymentRoutes
);

app.use(
    "/api/coupon",
    couponRoutes
);

app.use(
    "/api/consultation",
    consultationRoutes
);

app.use(
    "/api/contact",
    contactRoutes
);

app.use(
    "/api/projects",
    projectRoutes
);

app.use(
    "/api/stats",
    statsRoutes
);

// =====================================================
// ADMIN ROUTES
// =====================================================

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/admin/products",
    adminProductRoutes
);

app.use(
    "/api/admin/orders",
    adminOrderRoutes
);

app.use(
    "/api/coupon",
    couponRoutes
);

app.use(
    "/api/admin/coupons",
    adminCouponRoutes
);

app.use(
    "/api/admin/consultations",
    adminConsultationRoutes
);

app.use(
    "/api/admin/contacts",
    adminContactRoutes
);

app.use(
    "/api/admin/projects",
    adminProjectRoutes
);

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {

    res.send(
        "🚀 Modern Interiors Backend is Running..."
    );

});

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });

});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {

    console.error("SERVER ERROR:", err);

    res.status(500).json({
        success: false,
        message:
            err.message ||
            "Internal Server Error",
    });

});

// =====================================================
// PORT
// =====================================================

const PORT =
    process.env.PORT || 5000;

// =====================================================
// START SERVER
// =====================================================

const startServer = async () => {

    try {

        await connectDB();

        app.listen(
            PORT,
            () => {

                console.log(
                    `✅ Server is running on port ${PORT}`
                );
            }
        );

    } catch (err) {

        console.error(
            "Database Connection Failed"
        );

        console.error(err);

        process.exit(1);
    }
};

startServer();