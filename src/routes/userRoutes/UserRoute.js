const router = require('express').Router();
const { studentinfo } = require('../../controllers/studentInfocontrollers');
const {Registeruser, Login, allusers} = require('../../controllers/Usercontrollers');
const { authentication } = require('../../middlewares/auth');

router.post('/user-register', Registeruser);
router.post('/login', Login);
router.get('/all-user', authentication, allusers)
router.post('/student-info', authentication, studentinfo)

module.exports = router;