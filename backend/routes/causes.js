const express = require('express');
const Cause = require('../models/Cause');
const router = express.Router();

// Get all causes
router.get('/', async (req, res) => {
  try {
    const causes = await Cause.find();
    res.json(causes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch causes' });
  }
});

// Create a new cause
router.post('/', async (req, res) => {
  try {
    const cause = new Cause(req.body);
    await cause.save();
    res.status(201).json(cause);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create cause' });
  }
});

// Donate to a cause
router.post('/:id/donate', async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid donation amount' });
    }
    const cause = await Cause.findById(req.params.id);
    if (!cause) {
      return res.status(404).json({ message: 'Cause not found' });
    }
    cause.currentAmount += Number(amount);
    await cause.save();
    res.json({ message: 'Donation successful', cause });
  } catch (err) {
    res.status(500).json({ message: 'Failed to process donation' });
  }
});

module.exports = router; 