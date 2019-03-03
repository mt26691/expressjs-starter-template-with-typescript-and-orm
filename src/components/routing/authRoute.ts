import * as express from 'express';
import { AuthController } from '../../controllers/authController/authController';


const router = express.Router();


router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.get('/verify/:verifyToken', AuthController.verifyAccount);


export default router;
