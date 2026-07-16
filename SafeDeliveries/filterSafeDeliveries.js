function filterSafeDeliveries(deliveryQueue) {
    return deliveryQueue
        .filter(order => order.isFlooded === false)
        .map(order => `DISPATCH: Order #${order.orderId} for ${order.customer} to ${order.location}`);
}

const deliveryQueue = [
    { orderId: 101, customer: "Mateo", location: "España", isFlooded: true },
    { orderId: 102, customer: "Joshua", location: "BGC", isFlooded: false },
    { orderId: 103, customer: "Sofia", location: "Taft Avenue", isFlooded: true },
    { orderId: 104, customer: "Lukas", location: "Makati Legazpi", isFlooded: false },
    { orderId: 105, customer: "Elena", location: "Araneta Avenue", isFlooded: true },
    { orderId: 106, customer: "Amelie", location: "Ortigas Center", isFlooded: false }
];

const dispatchList = filterSafeDeliveries(deliveryQueue);

console.log(dispatchList);