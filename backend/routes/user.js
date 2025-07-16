import express from 'express';
import {
  updateProfile,
  changePassword,
  uploadAvatar,
  addAddress,
  updateAddress,
  deleteAddress,
  getAddresses
} from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';
import { upload } from '../controllers/uploadController.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

export default router;