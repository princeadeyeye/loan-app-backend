const express = require('express');
const userCtrl = require('../controllers/user-controller');
const authCtrl = require('../controllers/auth-controller');

const router = express.Router();


// create a lender
router.post('/api/v1/users/', authCtrl.requireSignin, userCtrl.createLender)

//listUsers articles
router.get('/api/v1/users/', userCtrl.listUsers)

//get user
router.get('/api/v1/users/:id', authCtrl.requireSignin, userCtrl.getUser)

// update user
router.put('/api/v1/users/:id', authCtrl.requireSignin, userCtrl.updateUser)

// delete agent
router.delete('/api/v1/users/:id', authCtrl.requireSignin, userCtrl.deleteUser)

module.exports = router;