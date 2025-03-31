import nodemailer from 'nodemailer';

// Function to send emails for withdrawal requests
export async function sendWithdrawalEmail(withdrawalData: {
  username: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  amount: number;
}) {
  const { username, accountName, accountNumber, bankName, amount } = withdrawalData;
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER || 'coastalloan60@gmail.com',
        pass: process.env.EMAIL_PASS || 'sphw oizv szzy fpgw',
      },
    });
    
    // Email content
    const mailOptions = {
      from: '"ISO9jaBet - Football Prediction" <' + (process.env.EMAIL_USER || 'coastalloan60@gmail.com') + '>',
      to: process.env.ADMIN_EMAIL || 'denzelbennie@outlook.com',
      subject: `ISO9jaBet Withdrawal Request from ${username}`,
      html: `
        <h2>ISO9jaBet - New Withdrawal Request</h2>
        <p><strong>User:</strong> ${username}</p>
        <p><strong>Amount:</strong> ₦${amount}</p>
        <p><strong>Bank Details:</strong></p>
        <ul>
          <li><strong>Account Name:</strong> ${accountName}</li>
          <li><strong>Account Number:</strong> ${accountNumber}</li>
          <li><strong>Bank:</strong> ${bankName}</li>
        </ul>
        <p>Please process this request as soon as possible.</p>
        <p>Regards,<br>ISO9jaBet Team</p>
      `,
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending withdrawal email:', error);
    return { success: false, error };
  }
}

// Lucky Spin weights and amounts
export const luckySpinOptions = [
  { amount: 3000, weight: 40 },
  { amount: 4000, weight: 20 },
  { amount: 5000, weight: 15 },
  { amount: 6000, weight: 10 },
  { amount: 7000, weight: 10 },
  { amount: 8000, weight: 5 }
];

// Function to spin the lucky wheel with weighted probabilities
export function spinLuckyWheel(): number {
  const totalWeight = luckySpinOptions.reduce((sum, option) => sum + option.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const option of luckySpinOptions) {
    random -= option.weight;
    if (random <= 0) {
      return option.amount;
    }
  }
  
  // Fallback to first option if something goes wrong
  return luckySpinOptions[0].amount;
}

// Helper functions for date manipulation
export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('NGN', '₦');
}

// Authentication
export function isAuthenticated(req: any): boolean {
  return !!req.session?.user;
}

// VIP code validation
export function validateVIPCode(code: string): boolean {
  return code === 'ISO9';
}

// Withdrawal code validation
// Users must buy the withdrawal activation key separately
export function validateWithdrawalCode(code: string): boolean {
  // No more hardcoded key, users must buy it
  return false;
}
