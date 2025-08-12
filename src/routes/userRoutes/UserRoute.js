const router = require('express').Router();
const { getNotifications } = require('../../controllers/notification');
const { studentinfo } = require('../../controllers/studentInfocontrollers');
const {Registeruser, Login, allusers} = require('../../controllers/Usercontrollers');
const { authentication } = require('../../middlewares/auth');

router.post('/user-register', Registeruser);
router.post('/login', Login);
router.get('/all-user', authentication, allusers)
router.post('/student-info', authentication, studentinfo)
// router.get('/')
router.get('/notification', authentication, getNotifications);

module.exports = router;