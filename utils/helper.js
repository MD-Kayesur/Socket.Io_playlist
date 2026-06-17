export function validateOrder(data) {
    if (!data) {
        return { valid: false, message: "Order data is required" };
    }
    if (!data.customerName?.trim()) {
        return { valid: false, message: "Customer name is required" };
    }
    if (!data.courierName?.trim()) {
        return { valid: false, message: "Courier name is required" };
    }
    if (!data.courierPhone?.trim()) {
        return { valid: false, message: "Courier phone is required" };
    }
    if (!data.customerAddress?.trim()) {
        return { valid: false, message: "Pickup address is required" };
    }
    if (!data.deliveryAddress?.trim()) {
        return { valid: false, message: "Delivery address is required" };
    }
    if (!Array.isArray(data.items) || data.items.length === 0) {
        return { valid: false, message: "Items must be a non-empty array" };
    }
    return { valid: true, message: "Valid Order" };
}

// Order ID generator -> format: ORD-YYYYMMDDHHMMSSMS-RAND
export function generateOrderId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
    const random = Math.floor(1000 + Math.random() * 9000).toString().padStart(4, "0");

    return `ORD-${year}${month}${day}${hour}${min}${second}${milliseconds}-${random}`;
}

export function calculateTotals(items) {
    if (!Array.isArray(items)) {
        return {
            subTotal: 0,
            tax: 0,
            deliveryFee: 0,
            deleveryFee: 0,
            totalAmount: 0
        };
    }
    const subTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subTotal * 0.10;
    const deliveryFee = 35.00;
    const total = subTotal + tax + deliveryFee;

    return {
        subTotal: Math.round(subTotal * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        deliveryFee: Math.round(deliveryFee * 100) / 100,
        deleveryFee: Math.round(deliveryFee * 100) / 100, // backward compatibility
        totalAmount: Math.round(total * 100) / 100
    };
}

export function createOrderDocument(orderData, orderId, totals) {
    return {
        orderId,
        costomerName: orderData.customerName?.trim(),
        customerName: orderData.customerName?.trim(),
        costomerPhone: orderData.customerPhone?.trim() || orderData.courierPhone?.trim(),
        customerPhone: orderData.customerPhone?.trim() || orderData.courierPhone?.trim(),
        costomerAddress: orderData.customerAddress?.trim(),
        customerAddress: orderData.customerAddress?.trim(),
        deliveryAddress: orderData.deliveryAddress?.trim(),
        items: orderData.items,
        courierName: orderData.courierName?.trim() || '',
        courierPhone: orderData.courierPhone?.trim() || '',
        paymentMethod: orderData.paymentMethod,
        status: "pending", // created, confirmed, assigned, collected, delivered, cancelled
        totals,
        timestamps: {
            createdAt: new Date(),
            updatedAt: new Date()
        }
    };
}

export function inValidStatusTransition(currentStatus, newStatus) {
    const validTransitions = {
        'pending': ['confirmed', 'cancelled'],
        'confirmed': ['assigned', 'cancelled'],
        'assigned': ['collected', 'cancelled'],
        'ready': ['out_for_delivery', 'cancelled'],
        'out_for_delivery': ['delivered', 'cancelled'],
        'delivered': ['cancelled'],
        'cancelled': []
    };
    const validNextStatus = validTransitions[currentStatus];
    if (!validNextStatus) return true;
    if (validNextStatus.includes(newStatus)) {
        return false;
    }
    return true;
}