const router = require('express').Router();
const transactionRoutes = require('./transaction-routes');

router.use('/transaction', transactionRoutes);

module.exports = router;
