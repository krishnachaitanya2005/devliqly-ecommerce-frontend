import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  verified: {
    type: Boolean,
    default: false
  },
  avatar: {
    public_id: String,
    secure_url: String
  },
  addresses: [{
    name: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false }
  }],
  otpRequests: [{
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['signup', 'forgot'], default: 'signup' }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Clean up expired OTP requests (older than 1 hour)
userSchema.methods.cleanupOtpRequests = function() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  this.otpRequests = this.otpRequests.filter(req => req.timestamp > oneHourAgo);
  return this.save();
};

// Check if user can request OTP (max 4 per hour)
userSchema.methods.canRequestOtp = function() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentRequests = this.otpRequests.filter(req => req.timestamp > oneHourAgo);
  return recentRequests.length < 4;
};

export default mongoose.model('User', userSchema);