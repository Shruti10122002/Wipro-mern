// invoice.js - Clean async/await

export async function generateInvoice(order, payment) {
  console.log("Generating invoice...");

  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate PDF

  const invoice = {
    invoiceId: "INV" + Date.now(),
    orderId: order.orderId,
    amount: order.total,
    transactionId: payment.transactionId,
    date: new Date().toLocaleString()
  };

  console.log("Invoice generated:", invoice.invoiceId);
  return invoice;
}