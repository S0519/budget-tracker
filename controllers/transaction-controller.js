const {Transaction} = require("../models");

exports.getTransactions = (req, res) => {
	Transaction.find()
		.sort({ date: -1 })
		.then(allTransactions => res.status(200).send(allTransactions))
		.catch(err => res.status(400).send(err));
}

exports.createTransaction = (req, res) => {
	Transaction.create(req.body)
		.then(newTransaction => res.status(200).send(newTransaction))
		.catch(err => res.status(400).send(err));
}

exports.bulkCreateTransaction = (req, res) => {
	Transaction.insertMany(req.body)
		.then(newTransactions => res.status(200).send(newTransactions))
		.catch(err => res.status(400).send(err));
}
