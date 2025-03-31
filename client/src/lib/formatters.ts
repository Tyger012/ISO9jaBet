// Format currency 
export const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG')}`;
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Format time
export const formatTime = (timeString: string): string => {
  // Expecting time format like "18:30"
  return timeString;
};

// Format countdown
export const formatCountdown = (targetDate: string, targetTime: string): string => {
  const now = new Date();
  const target = new Date(`${targetDate} ${targetTime}`);
  
  const diffMs = target.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return "Started";
  }
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  }
  
  return `${diffMinutes}m`;
};

// Get initial from username
export const getInitials = (username: string): string => {
  if (!username) return "";
  
  const names = username.split(" ");
  if (names.length === 1) {
    return username.substring(0, 2).toUpperCase();
  }
  
  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
};

// Format relative time
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  
  if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  
  if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  }
  
  return 'Just now';
};

// Calculate withdrawal progress percentage
export const calculateWithdrawalProgress = (balance: number): number => {
  const target = 30000;
  const percentage = (balance / target) * 100;
  return Math.min(100, Math.max(0, percentage));
};
