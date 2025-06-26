const mongoose = require('mongoose');
const Cause = require('../models/Cause');
require('dotenv').config();

const causes = [
  {
    title: 'Clean Water for All',
    description: 'Help build wells and provide clean water to rural communities.',
    category: 'community',
    goalAmount: 5000,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
    status: 'active',
  },
  {
    title: 'Emergency Medical Fund',
    description: 'Support urgent medical care for families in crisis.',
    category: 'medical',
    goalAmount: 10000,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60), // 60 days from now
    status: 'active',
  },
  {
    title: 'Education for Every Child',
    description: 'Provide school supplies and tuition for underprivileged children.',
    category: 'education',
    goalAmount: 8000,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45), // 45 days from now
    status: 'active',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Cause.deleteMany({});
  await Cause.insertMany(causes);
  console.log('Sample causes seeded!');
  process.exit();
}

seed(); 