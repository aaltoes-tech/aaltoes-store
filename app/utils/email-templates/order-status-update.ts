export function generateOrderStatusUpdateEmail(order: {
  id: string;
  user: {
    name: string | null;
    email: string;
  };
  status: string;
  createdAt: Date;
  comment?: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Aaltoes Store - Order Status Update</title>
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
          .status-update {
            background-color: #f3f4f6;
            padding: 24px;
            border-radius: 8px;
            margin-bottom: 24px;
            text-align: center;
          }
          .status {
            display: inline-block;
            padding: 8px 16px;
            background-color: #111827;
            color: white;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            margin: 16px 0;
          }
          .order-info {
            background-color: #f9fafb;
            padding: 24px;
            border-radius: 8px;
            margin-bottom: 24px;
          }
          p {
            margin: 0 0 12px 0;
            color: #4b5563;
          }
          strong {
            color: #111827;
            font-weight: 500;
          }
          .footer {
            text-align: center;
            margin-top: 32px;
            font-size: 14px;
            color: #6b7280;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://amaranth-defiant-snail-192.mypinata.cloud/ipfs/bafkreihnfvqvvurownkewgmwxk5u76hvhsco3jjjvwzr5fyfsgovi2loza" alt="Aaltoes Logo" class="logo">
          </div>
          <div class="header-content" style="text-align: center;">
            <h1>Order Status Update</h1>
          </div>

          <div class="status-update">
            <p>Your order status has been updated</p>
            <div class="status">${order.status}</div>
            ${order.comment && order.status === 'CANCELLED' ? `<p><strong>Reason:</strong> ${order.comment}</p>` : ''}
          </div>

          <div class="footer">
            <p>If you have any questions about your order, please contact us at <a href="mailto:board@aaltoes.com" style="color: #111827; text-decoration: none;">board@aaltoes.com</a></p>
          </div>
        </div>
      </body>
    </html>
  `
} 