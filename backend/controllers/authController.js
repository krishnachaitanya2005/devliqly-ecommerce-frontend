import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { generateOTP } from '../utils/generateOTP.js';
import { sendOTPEmail } from '../utils/sendEmail.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.js';

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
export const signup = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }]
  });

  if (existingUser) {
    if (existingUser.verified) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Phone number already registered'
      });
    }
    
    // Check OTP request limit for existing unverified user
    if (!existingUser.canRequestOtp()) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please try again after an hour.'
      });
    }
  }

  // Generate OTP
  const otpCode = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  try {
    // Send OTP email
    await sendOTPEmail(email, otpCode, 'signup');

    if (existingUser && !existingUser.verified) {
      // Update existing unverified user
      existingUser.name = name;
      existingUser.phone = phone;
      existingUser.password = password;
      existingUser.otpRequests.push({ timestamp: new Date(), type: 'signup' });
      await existingUser.save();
    } else {
      // Create new user
      const user = new User({
        name,
        email,
        phone,
        password,
        otpRequests: [{ timestamp: new Date(), type: 'signup' }]
      });
      await user.save();
    }

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    const otp = new OTP({
      email,
      code: otpCode,
      type: 'signup',
      expiresAt: otpExpiry
    });
    await otp.save();

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.'
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.'
    });
  }
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Find OTP
  const otpRecord = await OTP.findOne({ 
    email: email.toLowerCase(), 
    code: otp,
    type: 'signup'
  });

  if (!otpRecord) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired OTP'
    });
  }

  // Find user
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Verify user
  user.verified = true;
  await user.save();

  // Delete OTP
  await OTP.deleteOne({ _id: otpRecord._id });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      verified: user.verified
    },
    accessToken,
    refreshToken
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: 'Identifier and password are required'
    });
  }

  // Find user by email or phone
  const user = await User.findOne({
    $or: [{ email: identifier }, { phone: identifier }]
  }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  if (!user.verified) {
    return res.status(401).json({
      success: false,
      message: 'Please verify your email before logging in'
    });
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(401).json({
      success: 'password not match'
    });
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      verified: user.verified
    },
    accessToken,
    refreshToken
  });
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token required'
    });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user || !user.verified) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Don't reveal if user exists or not
    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset OTP.'
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      success: false,
      message: 'Please verify your email first'
    });
  }

  // Check OTP request limit
  if (!user.canRequestOtp()) {
    return res.status(429).json({
      success: false,
      message: 'Too many OTP requests. Please try again after an hour.'
    });
  }

  // Generate OTP
  const otpCode = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  try {
    // Send OTP email
    await sendOTPEmail(email, otpCode, 'forgot');

    // Update user's OTP requests
    user.otpRequests.push({ timestamp: new Date(), type: 'forgot' });
    await user.save();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Save new OTP
    const otp = new OTP({
      email: email.toLowerCase(),
      code: otpCode,
      type: 'forgot',
      expiresAt: otpExpiry
    });
    await otp.save();

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.'
    });
  }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  // Find OTP
  const otpRecord = await OTP.findOne({ 
    email: email.toLowerCase(), 
    code: otp,
    type: 'forgot'
  });

  if (!otpRecord) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired OTP'
    });
  }

  // Find user
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Update password
  user.password = password;
  await user.save();

  // Delete OTP
  await OTP.deleteOne({ _id: otpRecord._id });

  res.status(200).json({
    success: true,
    message: 'Password reset successfully. Please login with your new password.'
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      verified: req.user.verified,
      avatar: req.user.avatar,
      addresses: req.user.addresses
    }
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  // In a real application, you might want to blacklist the token
  // For now, we'll just send a success response
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});