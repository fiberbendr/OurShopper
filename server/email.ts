import { Resend } from 'resend';
import type { PurchaseWithLineItems } from './storage';
import { format } from 'date-fns';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPurchaseNotification(purchase: PurchaseWithLineItems): Promise<void> {
  try {
    const formattedDate = format(new Date(purchase.date), 'MMMM d, yyyy');
    
    const lineItemsList = purchase.lineItems
      .map((item, index) => `${index + 1}. ${item.category}: $${parseFloat(item.price).toFixed(2)}`)
      .join('\n');
    
    const totalPrice = purchase.lineItems.reduce((sum, item) => {
      return sum + parseFloat(item.price);
    }, 0);
    
    const paymentDisplay = purchase.paymentType === 'Check' && purchase.checkNumber
      ? `${purchase.paymentType} #${purchase.checkNumber}`
      : purchase.paymentType;
    
    const emailBody = `
A new purchase has been added to OurShopper:

Date: ${formattedDate}
Place: ${purchase.place}
Payment Type: ${paymentDisplay}

Items:
${lineItemsList}

Total: $${totalPrice.toFixed(2)}
    `.trim();

    await resend.emails.send({
      from: 'OurShopper <onboarding@resend.dev>',
      to: 'fiberbendr@gmail.com',
      subject: `New Purchase: ${purchase.place} - $${totalPrice.toFixed(2)}`,
      text: emailBody,
    });

    console.log(`Email notification sent for purchase at ${purchase.place}`);
  } catch (error) {
    console.error('Failed to send email notification:', error);
    // Don't throw the error - we don't want email failures to break purchase creation
  }
}
