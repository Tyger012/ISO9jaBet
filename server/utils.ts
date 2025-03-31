import nodemailer from 'nodemailer';

// Create email transporter with SMTP details
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER || 'coastalloan60@gmail.com',
      pass: process.env.EMAIL_PASS || 'sphw oizv szzy fpgw',
    },
  });
};

// Function to send welcome emails to new users
export async function sendWelcomeEmail(userData: {
  username: string;
  email: string;
}) {
  const { username, email } = userData;
  
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: '"ISO9jaBet - Football Prediction" <' + (process.env.EMAIL_USER || 'coastalloan60@gmail.com') + '>',
      to: email,
      subject: `Welcome to ISO9jaBet, ${username}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #3b82f6;">Welcome to ISO9jaBet!</h1>
          </div>
          
          <p>Hello <strong>${username}</strong>,</p>
          
          <p>Thank you for joining ISO9jaBet, the premier football prediction platform in Nigeria! We're excited to have you on board.</p>
          
          <p>With ISO9jaBet, you can:</p>
          <ul>
            <li>Predict football matches and win real money</li>
            <li>Enjoy our daily lucky spin to win bonus funds</li>
            <li>Compete with other users on our leaderboard</li>
            <li>Withdraw your winnings directly to your bank account</li>
          </ul>
          
          <p>To get started, we've credited your account with a welcome bonus. Start predicting matches right away!</p>
          
          <div style="margin: 30px 0; padding: 15px; background-color: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 3px;">
            <p style="margin: 0; font-weight: bold;">Want more betting options?</p>
            <p style="margin: 10px 0 0 0;">Upgrade to VIP to make more simultaneous bets and enjoy higher withdrawal limits!</p>
          </div>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team at support@iso9jabet.com.</p>
          
          <p>Happy Betting!</p>
          <p>The ISO9jaBet Team</p>
        </div>
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

// Function to send VIP activation emails to admin
export async function sendVIPActivationEmail(userData: {
  username: string;
  email: string;
  userId: number;
}) {
  const { username, email, userId } = userData;
  
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: '"ISO9jaBet - Football Prediction" <' + (process.env.EMAIL_USER || 'coastalloan60@gmail.com') + '>',
      to: process.env.ADMIN_EMAIL || 'denzelbennie@outlook.com',
      subject: `ISO9jaBet VIP Activation Request from ${username}`,
      html: `
        <h2>ISO9jaBet - New VIP Activation Request</h2>
        <p><strong>User:</strong> ${username} (ID: ${userId})</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>This user has requested to activate VIP status and claims to have made the payment.</p>
        <p>Please verify payment and activate the VIP status for this user if payment is confirmed.</p>
        <p><strong>Payment Details:</strong></p>
        <ul>
          <li><strong>Account Number:</strong> 6100827551</li>
          <li><strong>Bank:</strong> OPay</li>
          <li><strong>Account Name:</strong> OMOBANKE JUMOKE ADEKAYERO</li>
          <li><strong>Amount:</strong> ₦5,000</li>
        </ul>
        <p>Regards,<br>ISO9jaBet System</p>
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending VIP activation email:', error);
    return { success: false, error };
  }
}

// Function to send emails for withdrawal requests
export async function sendWithdrawalEmail(withdrawalData: {
  username: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  amount: number;
  email?: string; // Optional user email for confirmation
}) {
  const { username, accountName, accountNumber, bankName, amount, email } = withdrawalData;
  
  try {
    // Create transporter
    const transporter = createTransporter();
    
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
    
    // Send email to admin
    const info = await transporter.sendMail(mailOptions);
    
    // If user email is provided, send confirmation to the user as well
    if (email) {
      const userMailOptions = {
        from: '"ISO9jaBet - Football Prediction" <' + (process.env.EMAIL_USER || 'coastalloan60@gmail.com') + '>',
        to: email,
        subject: `Your ISO9jaBet Withdrawal Request`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #3b82f6;">Withdrawal Request Received</h1>
            </div>
            
            <p>Hello <strong>${username}</strong>,</p>
            
            <p>We have received your withdrawal request for <strong>₦${amount}</strong>.</p>
            
            <p><strong>Bank Details:</strong></p>
            <ul>
              <li><strong>Account Name:</strong> ${accountName}</li>
              <li><strong>Account Number:</strong> ${accountNumber}</li>
              <li><strong>Bank:</strong> ${bankName}</li>
            </ul>
            
            <p>Your request is being processed and the funds will be transferred to your account shortly.</p>
            
            <p>Please note that withdrawals are typically processed within 24-48 hours.</p>
            
            <div style="margin: 30px 0; padding: 15px; background-color: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 3px;">
              <p style="margin: 0; font-weight: bold;">Withdrawal Status</p>
              <p style="margin: 10px 0 0 0;">You can check the status of your withdrawal in the transaction history section of your account.</p>
            </div>
            
            <p>Thank you for using ISO9jaBet!</p>
            <p>The ISO9jaBet Team</p>
          </div>
        `,
      };
      
      await transporter.sendMail(userMailOptions);
    }
    
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
  // Hardcoded withdrawal key for testing
  return code === 'ISO9KEY';
}
