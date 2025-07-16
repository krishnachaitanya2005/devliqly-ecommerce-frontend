import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  code: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['signup', 'forgot'],
    default: 'signup'
  },
  expiresAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 600 // 10 minutes
  }
}, {
  timestamps: true
});

export default mongoose.model('OTP', otpSchema);