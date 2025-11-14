

export function fetchOrder(orderId, callback) {
  console.log(`Fetching order ${orderId} from database...`);

  setTimeout(() => {
    if (orderId === 999) {
      // Simulate error
      callback(new Error("Order not found"), null);
    } else {
      const order = {
        orderId,
        items: ["Pizza", "Coke"],
        total: 850,
        customer: "John Doe"
      };
      callback(null, order);
    }
  }, 1000);
}