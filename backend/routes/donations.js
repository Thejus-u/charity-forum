const express = require('express');
const { body, validationResult } = require('express-validator');
const Donation = require('../models/Donation');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/donations
// @desc    Create a new donation campaign
// @access  Private
router.post('/', auth, [
  body('title')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('category')
    .isIn(['medical', 'education', 'disaster', 'community', 'environment', 'other'])
    .withMessage('Invalid category'),
  body('goalAmount')
    .isFloat({ min: 1 })
    .withMessage('Goal amount must be at least 1'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD'])
    .withMessage('Invalid currency')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      category,
      goalAmount,
      currency = 'USD',
      endDate,
      tags,
      location,
      image
    } = req.body;

    // Check if end date is in the future
    if (new Date(endDate) <= new Date()) {
      return res.status(400).json({ message: 'End date must be in the future' });
    }

    const donation = new Donation({
      title,
      description,
      category,
      goalAmount,
      currency,
      endDate,
      tags: tags || [],
      location: location || {},
      image: image || '',
      creator: req.user._id
    });

    await donation.save();

    // Populate creator info
    await donation.populate('creator', 'username firstName lastName avatar');

    res.status(201).json({
      message: 'Donation campaign created successfully',
      donation
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/donations
// @desc    Get all donation campaigns with filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status = 'active',
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOptions,
      populate: [
        { path: 'creator', select: 'username firstName lastName avatar' },
        { path: 'donors.user', select: 'username firstName lastName avatar' }
      ]
    };

    const donations = await Donation.paginate(query, options);

    res.json(donations);
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/donations/:id
// @desc    Get a specific donation campaign
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('creator', 'username firstName lastName avatar bio')
      .populate('donors.user', 'username firstName lastName avatar');

    if (!donation) {
      return res.status(404).json({ message: 'Donation campaign not found' });
    }

    // Increment views if user is authenticated
    if (req.user) {
      donation.incrementViews();
    }

    res.json(donation);
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/donations/:id/donate
// @desc    Make a donation to a campaign
// @access  Private
router.post('/:id/donate', auth, [
  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Amount must be at least 1'),
  body('message')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, message = '', isAnonymous = false } = req.body;

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation campaign not found' });
    }

    // Check if campaign is active
    if (!donation.isActive()) {
      return res.status(400).json({ message: 'This campaign is no longer active' });
    }

    // Add donation
    await donation.addDonation(req.user._id, amount, message, isAnonymous);

    // Update user's total donations
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalDonations: 1 }
    });

    // Populate the updated donation
    await donation.populate('creator', 'username firstName lastName avatar');
    await donation.populate('donors.user', 'username firstName lastName avatar');

    res.json({
      message: 'Donation made successfully',
      donation
    });
  } catch (error) {
    console.error('Make donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/donations/:id
// @desc    Update a donation campaign
// @access  Private (creator only)
router.put('/:id', auth, [
  body('title')
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .optional()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('category')
    .optional()
    .isIn(['medical', 'education', 'disaster', 'community', 'environment', 'other'])
    .withMessage('Invalid category'),
  body('goalAmount')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Goal amount must be at least 1'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation campaign not found' });
    }

    // Check if user is the creator
    if (donation.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this campaign' });
    }

    // Check if campaign has already received donations
    if (donation.donors.length > 0) {
      return res.status(400).json({ message: 'Cannot update campaign that has received donations' });
    }

    const updateFields = {};
    const { title, description, category, goalAmount, endDate, tags, location, image } = req.body;

    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (category) updateFields.category = category;
    if (goalAmount) updateFields.goalAmount = goalAmount;
    if (endDate) {
      if (new Date(endDate) <= new Date()) {
        return res.status(400).json({ message: 'End date must be in the future' });
      }
      updateFields.endDate = endDate;
    }
    if (tags) updateFields.tags = tags;
    if (location) updateFields.location = location;
    if (image !== undefined) updateFields.image = image;

    const updatedDonation = await Donation.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('creator', 'username firstName lastName avatar');

    res.json({
      message: 'Campaign updated successfully',
      donation: updatedDonation
    });
  } catch (error) {
    console.error('Update donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/donations/:id
// @desc    Delete a donation campaign
// @access  Private (creator only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation campaign not found' });
    }

    // Check if user is the creator
    if (donation.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this campaign' });
    }

    // Check if campaign has already received donations
    if (donation.donors.length > 0) {
      return res.status(400).json({ message: 'Cannot delete campaign that has received donations' });
    }

    await Donation.findByIdAndDelete(req.params.id);

    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Delete donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/donations/:id/updates
// @desc    Add an update to a donation campaign
// @access  Private (creator only)
router.post('/:id/updates', auth, [
  body('title')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('content')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Content must be between 10 and 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation campaign not found' });
    }

    // Check if user is the creator
    if (donation.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add updates to this campaign' });
    }

    donation.updates.push({ title, content });
    await donation.save();

    res.json({
      message: 'Update added successfully',
      update: donation.updates[donation.updates.length - 1]
    });
  } catch (error) {
    console.error('Add update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 