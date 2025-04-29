import { Resend } from 'resend'
import { generateOrderConfirmationEmail } from './email-templates/order-confirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmationEmail(order: {
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
  try {
    const { data, error } = await resend.emails.send({
      from: 'Aaltoes Store <store@aaltoes.com>',
      to: order.user.email,
      subject: `Order Confirmation - Order #${order.id}`,
      html: generateOrderConfirmationEmail(order),
    })

    if (error) {
      console.error('Failed to send email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
} 