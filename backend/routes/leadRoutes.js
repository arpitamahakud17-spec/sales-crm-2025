const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead
} = require('../controllers/leadController');

router.get('/', auth, getLeads);
router.get('/:id', auth, getLead);
router.post('/', auth, createLead);
router.put('/:id', auth, updateLead);
router.delete('/:id', auth, deleteLead);

module.exports = router;