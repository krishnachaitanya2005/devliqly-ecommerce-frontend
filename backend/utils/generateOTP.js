export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const isOTPExpired = (createdAt, expiryMinutes = 10) => {
  const now = new Date();
  const otpCreatedAt = new Date(createdAt);
  const diffInMinutes = (now - otpCreatedAt) / (1000 * 60);
  return diffInMinutes > expiryMinutes;
};