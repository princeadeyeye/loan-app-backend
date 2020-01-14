const express = require('express')
const authCtrl = require('../Controllers/auth-controller')


const router = express.Router()


// create a user
router.post('/api/v1/auth/create-user/', authCtrl.createUser)

// user signin
router.post('/api/v1/auth/signin', authCtrl.signin)

// user sign out
// router.get('auth/signout', authCtrl.signout)*/



module.exports = router;