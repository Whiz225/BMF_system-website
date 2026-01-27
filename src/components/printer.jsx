export const handlePrint = (sale) => {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${sale.saleNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .info { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total { text-align: right; font-weight: bold; font-size: 18px; }
          .footer { margin-top: 30px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Foam Business Manager</h1>
          <h2>SALES RECEIPT</h2>
        </div>
        <div class="info">
          <p><strong>Sale #:</strong> ${sale.saleNumber}</p>
          <p><strong>Date:</strong> ${format(
            new Date(sale.createdAt),
            "PPpp"
          )}</p>
          <p><strong>Sold by:</strong> ${sale.soldBy?.firstName || "N/A"}</p>
          ${
            sale.customer
              ? `<p><strong>Customer:</strong> ${sale.customer.name}</p>`
              : ""
          }
        </div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${
              sale.items
                ?.map(
                  (item) => `
              <tr>
                <td>${item.product?.name || "Product"}</td>
                <td>${item.quantity}</td>
                <td>₦${item.unitPrice?.toLocaleString()}</td>
                <td>₦${item.totalPrice?.toLocaleString()}</td>
              </tr>
            `
                )
                .join("") || ""
            }
          </tbody>
        </table>
        <div class="total">
          <p>Subtotal: ₦${sale.subtotal?.toLocaleString()}</p>
          <p>Discount: ₦${sale.discount?.toLocaleString()}</p>
          <p>Tax: ₦${sale.tax?.toLocaleString()}</p>
          <p><strong>TOTAL: ₦${sale.totalAmount?.toLocaleString()}</strong></p>
          <p>Paid: ₦${sale.amountPaid?.toLocaleString()}</p>
          <p>Balance: ₦${sale.balance?.toLocaleString()}</p>
        </div>
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>Generated on ${format(new Date(), "PPpp")}</p>
        </div>
      </body>
      </html>
    `);
  printWindow.document.close();
  printWindow.print();
};
