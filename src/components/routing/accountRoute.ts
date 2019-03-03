import * as express from 'express';
import { AccountController } from '../../controllers/accountController/accountController';
import { authMiddleware } from '../../middlewares/auth/AuthMiddleware';
const router = express.Router();


router.get('/me', authMiddleware, AccountController.getPersonalInformation);

export default router;
