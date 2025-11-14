// index.js
import { fetchOrder } from './db.js';
import { processPayment } from './payment.js';
import { generateInvoice } from './invoice.js';

// USER STORY 1: Callbacks
function handleOrderWithCallback(orderId) {
  console.log("\n=== USER STORY 1: CALLBACKS ===");
  fetchOrder(orderId, (error, order) => {
    if (error) {
      console.error("Error:", error.message);
      return;
    }
    console.log("Order fetched:", order);

    // USER STORY 2: Promises
    console.log("\n=== USER STORY 2: PROMISES ===");
    processPayment(order)
      .then(payment => {
        console.log("Payment successful:", payment);

        // USER STORY 3: Async/Await
        console.log("\n=== USER STORY 3: ASYNC/AWAIT ===");
        return generateInvoice(order, payment);
      })
      .then(invoice => {
        console.log("Final Invoice:", invoice);
        console.log("\nOrder processing completed successfully!\n");
      })
      .catch(err => {
        console.error("Payment or Invoice failed:", err.message);
      });
  });
}

// Alternative: Full Async/Await Version (Cleaner)
async function handleOrderModern(orderId) {
  console.log("\n=== MODERN FLOW: ASYNC/AWAIT ONLY ===");
  try {
    const order = await new Promise((resolve, reject) => {
      fetchOrder(orderId, (err, data) => err ? reject(err) : resolve(data));
    });

    const payment = await processPayment(order);
    const invoice = await generateInvoice(order, payment);

    console.log("Full Success (Modern):", invoice);
  } catch (err) {
    console.error("Failed:", err.message);
  }
}

// Run both demos
handleOrderWithCallback(101);    // Success case
// handleOrderWithCallback(999); // Error case (uncomment to test)

// handleOrderModern(101);       // Uncomment for clean async/await