export function generateAdminNotificationEmail(data: {
  subject: string;
  message: string;
  createdAt: Date;
  orderId?: string;
}) {
  const formattedDate = new Date(data.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Aaltoes Store - Admin Notification</title>
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
          .notification {
            background-color: #f3f4f6;
            padding: 24px;
            border-radius: 8px;
            margin-bottom: 24px;
          }
          .notification p {
            margin: 0 0 12px 0;
            color: #4b5563;
          }
          .notification strong {
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
          .button {
            display: inline-block;
            background-color: #111827;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            margin-top: 16px;
            transition: all 0.2s ease;
          }
          .button:hover {
            background-color: #1f2937;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .order-id {
            background-color: #111827;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-family: monospace;
            font-size: 14px;
            margin: 16px 0;
            display: inline-block;
          }
          .info-grid {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 8px 16px;
            margin: 16px 0;
          }
          .info-label {
            color: #6b7280;
            font-size: 14px;
          }
          .info-value {
            color: #111827;
            font-weight: 500;
          }
          .message-box {
            background-color: white;
            padding: 16px;
            border-radius: 6px;
            margin: 16px 0;
            border: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://amaranth-defiant-snail-192.mypinata.cloud/ipfs/bafkreihnfvqvvurownkewgmwxk5u76hvhsco3jjjvwzr5fyfsgovi2loza" alt="Aaltoes Logo" class="logo">
          </div>
          <div class="header-content" style="text-align: center;">
            <h1>Admin Notification</h1>
          </div>

          <div class="notification">
            <div class="info-grid">
              <span class="info-label">Subject:</span>
              <span class="info-value">${data.subject}</span>
              <span class="info-label">Time:</span>
              <span class="info-value">${formattedDate}</span>
            </div>

            ${data.orderId ? `
              <div style="text-align: center;">
                <span class="order-id">Order #${data.orderId}</span>
              </div>
            ` : ''}

            <div class="message-box">
              <p>${data.message}</p>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/admin/orders/${data.orderId}" class="button">
                View Order
              </a>
            </div>
          </div>

          <div class="footer">
            <p>This is an automated notification from Aaltoes Store.</p>
          </div>
        </div>
      </body>
    </html>
  `
} 