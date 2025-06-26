const express = require('express');
const Testimonial = require('../models/Testimonial');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().populate('user', 'username firstName lastName avatar').sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
});

// Add a new testimonial
router.post('/', auth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.length < 5) {
      return res.status(400).json({ message: 'Message must be at least 5 characters' });
    }
    const testimonial = new Testimonial({
      user: req.user._id,
      message
    });
    await testimonial.save();
    await testimonial.populate('user', 'username firstName lastName avatar');
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add testimonial' });
  }
});

module.exports = router; 