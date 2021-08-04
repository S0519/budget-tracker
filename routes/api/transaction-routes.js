const {getTransactions, createTransaction, bulkCreateTransaction} = require("../../controllers/transaction-controller");
const router = require('express').Router();

router
	.route('/')
	.get(getTransactions)
	.post(createTransaction);

router
	.route('/bulk')
	.post(bulkCreateTransaction);

module.exports = router;
