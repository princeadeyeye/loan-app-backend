const express = require('express');
const loanCtrl = require('../controllers/loan-controller');
const authCtrl = require('../controllers/auth-controller')

const router = express.Router();

//create article
 router.post('/api/v1/loans/', authCtrl.requireSignin, loanCtrl.createLoan)


//create article
 router.get('/api/v1/loans/', authCtrl.requireSignin, loanCtrl.listLoans)


// update article
router.patch('/api/v1/loans/:id', authCtrl.requireSignin, loanCtrl.updateLoan)

// delete article 
router.delete('/api/v1/loans/:id', authCtrl.requireSignin, loanCtrl.deleteLoan)

 // view specific article
 router.get('/api/v1/loans/:id', authCtrl.requireSignin, loanCtrl.getLoan)



module.exports = router;
