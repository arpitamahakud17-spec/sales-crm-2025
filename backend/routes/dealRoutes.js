const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal
} = require('../controllers/dealController');

router.get('/', auth, getDeals);
router.get('/:id', auth, getDeal);
router.post('/', auth, createDeal);
router.put('/:id', auth, updateDeal);
router.delete('/:id', auth, deleteDeal);

module.exports = router;
