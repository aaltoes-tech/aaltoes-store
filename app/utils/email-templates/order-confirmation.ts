export function generateOrderConfirmationEmail(order: {
  id: string;
  user: {
    name: string | null;
    email: string;
  };
  items: Array<{
    product: {
      name: string;
      price: number;
      type: string;
      image?: string;
    };
    quantity: number;
    size?: string | null;
    total: number;
  }>;
  total: number;
  createdAt: Date;
  phone_number?: string;
  comment?: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Aaltoes Store - Order Confirmation</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
          }
          .container {
            background-color: white;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 1px solid #e5e7eb;
          }
          .logo {
            max-width: 180px;
            margin-bottom: 24px;
          }
          h1 {
            font-size: 24px;
            font-weight: 600;
            color: #111827;
            margin: 0 0 8px 0;
          }
          h2 {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin: 0 0 16px 0;
          }
          .order-info {
            background-color: #f9fafb;
            padding: 24px;
            border-radius: 8px;
            margin-bottom: 24px;
          }
          .items {
            margin-bottom: 24px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
          }
          .items-table th {
            text-align: left;
            padding: 12px;
            background-color: #f9fafb;
            border-bottom: 2px solid #e5e7eb;
            font-weight: 500;
            color: #4b5563;
          }
          .items-table td {
            padding: 16px 12px;
            border-bottom: 1px solid #e5e7eb;
            vertical-align: top;
          }
          .item-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 6px;
          }
          .item-details {
            padding-left: 12px;
          }
          .total {
            text-align: right;
            font-weight: 600;
            font-size: 18px;
            margin-top: 24px;
            padding-top: 24px;
            color: #111827;
          }
          .footer {
            text-align: center;
            margin-top: 32px;
            font-size: 14px;
            color: #6b7280;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
          }
          .status {
            display: inline-block;
            padding: 4px 8px;
            background-color: #111827;
            color: white;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            margin-left: 8px;
          }
          .badge {
            display: inline-block;
            padding: 4px 8px;
            background-color: #f3f4f6;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            color: #4b5563;
            margin-right: 8px;
            margin-bottom: 8px;
          }
          p {
            margin: 0 0 12px 0;
            color: #4b5563;
          }
          strong {
            color: #111827;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://amaranth-defiant-snail-192.mypinata.cloud/ipfs/bafkreihnfvqvvurownkewgmwxk5u76hvhsco3jjjvwzr5fyfsgovi2loza" alt="Aaltoes Logo" class="logo">
          </div>
          <div class="header-content" style="text-align: center;">
            <h1>Order Confirmation</h1>
            <p>Admin will review your order and get back to you soon.</p>
          </div>

          <div class="order-info">
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Customer:</strong> ${order.user.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${order.user.email}</p>
            ${order.phone_number ? `<p><strong>Phone:</strong> ${order.phone_number}</p>` : ''}
            ${order.comment ? `<p><strong>Comment:</strong> ${order.comment}</p>` : ''}
          </div>

          <div class="items">
            <h2>Order Items</h2>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Details</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>
                      <img src="${item.product.image || '/placeholder-image.jpg'}" alt="${item.product.name}" class="item-image">
                    </td>
                    <td class="item-details">
                      <p><strong>${item.product.name}</strong></p>
                      <div>
                        <span class="badge">${item.product.type}</span>
                        ${item.size ? `<span class="badge">${item.size}</span>` : ''}
                      </div>
                    </td>
                    <td>${item.quantity}</td>
                    <td>€${item.product.price.toFixed(2)}</td>
                    <td>€${item.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
          </div>

          <div class="total">
            <p>Total: €${order.total.toFixed(2)}</p>
          </div>

          <div class="footer">
            <p>If you have any questions about your order, please contact us at <a href="mailto:board@aaltoes.com" style="color: #111827; text-decoration: none;">board@aaltoes.com</a></p>
            <p>Thank you for shopping with Aaltoes!</p>
          </div>
        </div>
      </body>
    </html>
  `
} 