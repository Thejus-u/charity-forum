const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['medical', 'education', 'disaster', 'community', 'environment', 'other']
  },
  goalAmount: {
    type: Number,
    required: true,
    min: 1
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  image: {
    type: String,
    default: ''
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'expired'],
    default: 'active'
  },
  endDate: {
    type: Date,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  location: {
    country: String,
    city: String,
    address: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  donors: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    message: {
      type: String,
      maxlength: 500
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    donatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  updates: [{
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Virtual for progress percentage
donationSchema.virtual('progressPercentage').get(function() {
  return Math.min((this.currentAmount / this.goalAmount) * 100, 100);
});

// Virtual for days remaining
donationSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const end = new Date(this.endDate);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Method to add donation
donationSchema.methods.addDonation = function(userId, amount, message = '', isAnonymous = false) {
  this.donors.push({
    user: userId,
    amount,
    message,
    isAnonymous
  });
  this.currentAmount += amount;
  return this.save();
};

// Method to check if campaign is active
donationSchema.methods.isActive = function() {
  return this.status === 'active' && new Date() < this.endDate;
};

module.exports = mongoose.model('Donation', donationSchema); 