// payment.js - Return Promise

export function processPayment(order) {
  return new Promise((resolve, reject) => {
    console.log(`Processing payment of ₹${order.total}...`);

    setTimeout(() => {
      if (order.total > 5000) {
        reject(new Error("Payment declined: Amount too high"));
      } else {
        resolve({ transactionId: "TXN" + Date.now(), status: "success" });
      }
    }, 1500);
  });
}