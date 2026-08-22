const Order = require("../models/Order");

// =====================================================
// GET ALL ORDERS
// =====================================================

const getAllOrders = async (
    req,
    res
) => {
    try {
        const orders =
            await Order.find()
                .populate(
                    "user",
                    "name email phone city state pincode address"
                )
                .populate(
                    "items.furniture",
                    "name image price priceValue category"
                )
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error) {
        console.error(
            "GET ALL ORDERS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch orders",
        });
    }
};

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

const updateOrderStatus = async (
    req,
    res
) => {
    try {
        const { status } =
            req.body;

        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Processing",
            "Shipped",
            "Out for Delivery",
            "Delivered",
            "Cancelled",
        ];

        if (
            !allowedStatuses.includes(
                status
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid Order Status",
            });
        }

        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {
            return res.status(404).json({
                success: false,
                message:
                    "Order Not Found",
            });
        }

        order.status = status;

        // Delivery date
        if (status === "Delivered") {
            order.deliveredAt =
                new Date();
        } else {
            order.deliveredAt =
                undefined;
        }

        // Estimated delivery
        if (
            status === "Shipped" ||
            status === "Out for Delivery"
        ) {
            if (
                !order.estimatedDelivery
            ) {
                const deliveryDate =
                    new Date();

                deliveryDate.setDate(
                    deliveryDate.getDate() +
                        3
                );

                order.estimatedDelivery =
                    deliveryDate;
            }
        }

        await order.save();

        const updatedOrder =
            await Order.findById(
                order._id
            )
                .populate(
                    "user",
                    "name email phone city state pincode address"
                )
                .populate(
                    "items.furniture",
                    "name image price priceValue category"
                );

        return res.status(200).json({
            success: true,
            message:
                "Order Status Updated Successfully",
            order: updatedOrder,
        });
    } catch (error) {
        console.error(
            "UPDATE ORDER STATUS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update order status",
        });
    }
};

// =====================================================
// DELETE ORDER
// =====================================================

const deleteOrder = async (
    req,
    res
) => {
    try {
        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {
            return res.status(404).json({
                success: false,
                message:
                    "Order Not Found",
            });
        }

        await order.deleteOne();

        return res.status(200).json({
            success: true,
            message:
                "Order Deleted Successfully",
        });
    } catch (error) {
        console.error(
            "DELETE ORDER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to delete order",
        });
    }
};

module.exports = {
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
};