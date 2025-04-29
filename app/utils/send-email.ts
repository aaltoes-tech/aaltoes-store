import { Resend } from 'resend'
import { generateOrderConfirmationEmail } from './email-templates/order-confirmation'
import { generateOrderStatusUpdateEmail } from './email-templates/order-status-update'
import { generateAdminNotificationEmail } from './email-templates/admin-notification'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailData {
  from: string;
  to: string;
  subject: string;
  html: string;
}

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
  try {
    const emailData: EmailData = {
      from: 'Aaltoes Store <store@aaltoes.com>',
      to: order.user.email,
      subject: `Order Confirmation - Order #${order.id}`,
      html: generateOrderConfirmationEmail(order)
    }

    const { data, error } = await resend.emails.send(emailData)

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

export async function sendOrderStatusUpdateEmail(order: {
  id: string;
  user: {
    name: string | null;
    email: string;
  };
  status: string;
  createdAt: Date;
  comment?: string;
}) {
  try {
    const emailData: EmailData = {
      from: 'Aaltoes Store <store@aaltoes.com>',
      to: order.user.email,
      subject: `Order Status Update - Order #${order.id}`,
      html: generateOrderStatusUpdateEmail(order)
    }

    const { data, error } = await resend.emails.send(emailData)

    if (error) {
      console.error('Failed to send status update email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending status update email:', error)
    return { success: false, error }
  }
}

export async function sendAdminNotification(data: {
  subject: string;
  message: string;
  orderId?: string;
}) {
  try {
    const emailData: EmailData = {
      from: 'Aaltoes Store <store@aaltoes.com>',
      to: process.env.ADMIN_EMAIL || '',
      subject: `Notification: ${data.subject}`,
      html: generateAdminNotificationEmail({
        ...data,
        createdAt: new Date()
      })
    }

    const { data: responseData, error } = await resend.emails.send(emailData)

    if (error) {
      console.error('Failed to send admin notification:', error)
      return { success: false, error }
    }

    return { success: true, data: responseData }
  } catch (error) {
    console.error('Error sending admin notification:', error)
    return { success: false, error }
  }
} 