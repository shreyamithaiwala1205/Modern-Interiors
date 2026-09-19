const User = require("../models/User");
const Order = require("../models/Order");
const Furniture = require("../models/Furniture");

// =====================================================
// ADMIN DASHBOARD
// =====================================================

const getDashboard = async (req, res) => {
    try {
        const totalUsers =
            await User.countDocuments();

        const totalProducts =
            await Furniture.countDocuments();

        const totalOrders =
            await Order.countDocuments();

        const lowStockProducts =
            await Furniture.find({
                stock: { $lte: 5, $gt: 0 },
            })
                .select("name stock image")
                .sort({ stock: 1 })
                .limit(5);

        const outOfStockProducts =
            await Furniture.find({
                stock: { $lte: 0 },
            })
                .select(
                    "name stock image isVisible autoHiddenDueToStock"
                )
                .sort({ updatedAt: -1 })
                .limit(5);

        const outOfStockCount =
            await Furniture.countDocuments({
                stock: { $lte: 0 },
            });

        const revenue =
            await Order.aggregate([
                {
                    $match: {
                        status: {
                            $in: [
                                "Pending",
                                "Confirmed",
                                "Processing",
                                "Shipped",
                                "Out for Delivery",
                                "Delivered",
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: "$totalPrice",
                        },
                    },
                },
            ]);

        const recentOrders =
            await Order.find()
                .populate(
                    "user",
                    "name email"
                )
                .sort({
                    createdAt: -1,
                })
                .limit(5);

        return res.status(200).json({
            success: true,

            dashboard: {
                totalUsers,
                totalProducts,
                totalOrders,

                totalRevenue:
                    revenue.length > 0
                        ? revenue[0].totalRevenue
                        : 0,

                recentOrders,
                lowStockProducts,
                outOfStockProducts,
                outOfStockCount,
            },
        });
    } catch (error) {
        console.error(
            "GET DASHBOARD ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load dashboard",
        });
    }
};

// =====================================================
// MONTHLY REVENUE
// =====================================================

const getRevenueChart = async (
    req,
    res
) => {
    try {
        const revenue =
            await Order.aggregate([
                {
                    $match: {
                        status: {
                            $in: [
                                "Pending",
                                "Confirmed",
                                "Processing",
                                "Shipped",
                                "Out for Delivery",
                                "Delivered",
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            month: {
                                $month:
                                    "$createdAt",
                            },
                        },

                        revenue: {
                            $sum: "$totalPrice",
                        },
                    },
                },
                {
                    $sort: {
                        "_id.month": 1,
                    },
                },
            ]);

        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const chartData =
            months.map(
                (month, index) => {
                    const found =
                        revenue.find(
                            (item) =>
                                item._id
                                    .month ===
                                index + 1
                        );

                    return {
                        month,
                        revenue: found
                            ? found.revenue
                            : 0,
                    };
                }
            );

        return res.status(200).json({
            success: true,
            chartData,
        });
    } catch (error) {
        console.error(
            "REVENUE CHART ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load revenue chart",
        });
    }
};

// =====================================================
// GET ALL USERS
// =====================================================

const getAllUsers = async (
    req,
    res
) => {
    try {

        // IMPORTANT:
        // Fetch BOTH users and admins.
        // Previously admins were excluded with:
        // role: { $ne: "admin" }

        const users =
            await User.find({})
                .select("-password")
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,
            count: users.length,
            users,
        });

    } catch (error) {

        console.error(
            "GET USERS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch users",
        });
    }
};

// =====================================================
// DELETE USER
// =====================================================

const deleteUser = async (
    req,
    res
) => {
    try {
        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User Not Found",
            });
        }

        // Keep existing protection:
        // Admin cannot be deleted.
        if (user.role === "admin") {
            return res.status(400).json({
                success: false,
                message:
                    "Admin cannot be deleted",
            });
        }

        // Keep existing protection:
        // Current logged-in admin cannot delete own account.
        if (
            req.user &&
            user._id.toString() ===
                req.user._id.toString()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "You cannot delete your own account",
            });
        }

        await user.deleteOne();

        return res.status(200).json({
            success: true,
            message:
                "User Deleted Successfully",
        });
    } catch (error) {
        console.error(
            "DELETE USER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to delete user",
        });
    }
};

// =====================================================
// UPDATE USER
// =====================================================

const updateUser = async (
    req,
    res
) => {
    try {
        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User Not Found",
            });
        }

        if (
            req.body.role &&
            !["user", "admin"].includes(
                req.body.role
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid Role",
            });
        }

        if (
            req.body.name !== undefined
        ) {
            user.name =
                String(
                    req.body.name
                ).trim();
        }

        if (
            req.body.phone !== undefined
        ) {
            user.phone =
                String(
                    req.body.phone
                ).trim();
        }

        if (
            req.body.city !== undefined
        ) {
            user.city =
                String(
                    req.body.city
                ).trim();
        }

        if (
            req.body.state !== undefined
        ) {
            user.state =
                String(
                    req.body.state
                ).trim();
        }

        if (
            req.body.pincode !== undefined
        ) {
            user.pincode =
                String(
                    req.body.pincode
                ).trim();
        }

        if (
            req.body.address !== undefined
        ) {
            user.address =
                String(
                    req.body.address
                ).trim();
        }

        if (
            req.body.role !== undefined
        ) {
            user.role =
                req.body.role;
        }

        await user.save();

        const safeUser =
            user.toObject();

        delete safeUser.password;

        return res.status(200).json({
            success: true,
            message:
                "User Updated Successfully",
            user: safeUser,
        });
    } catch (error) {
        console.error(
            "UPDATE USER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update user",
        });
    }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    getDashboard,
    getRevenueChart,
    getAllUsers,
    deleteUser,
    updateUser,
};