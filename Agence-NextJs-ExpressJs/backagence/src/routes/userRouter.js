
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/verify-email', userController.verifyEmail);
router.post('/registerbyadmin', authMiddleware, isAdmin, userController.registerByAdmin);
router.get('/findAll', authMiddleware, isAdmin, userController.findByAll);
router.get('/findAllUSER', authMiddleware, isAdmin, userController.findByroleUser);
router.get('/findbyrole', authMiddleware, userController.GetUserByROLE);
router.get('/deleted/:id', authMiddleware, isAdmin, userController.deleted);
router.put('/update/:id', authMiddleware, isAdmin, userController.updateUser);

router.get('/getuserbyid/:id', authMiddleware, userController.GetUserByIds);

module.exports = router;
