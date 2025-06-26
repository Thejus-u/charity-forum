const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['general', 'donation-stories', 'volunteering', 'fundraising', 'community', 'news', 'help']
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  relatedDonation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  },
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for like count
forumPostSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for dislike count
forumPostSchema.virtual('dislikeCount').get(function() {
  return this.dislikes.length;
});

// Virtual for comment count
forumPostSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Method to add like
forumPostSchema.methods.addLike = function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    // Remove from dislikes if exists
    this.dislikes = this.dislikes.filter(id => id.toString() !== userId.toString());
  }
  return this.save();
};

// Method to add dislike
forumPostSchema.methods.addDislike = function(userId) {
  if (!this.dislikes.includes(userId)) {
    this.dislikes.push(userId);
    // Remove from likes if exists
    this.likes = this.likes.filter(id => id.toString() !== userId.toString());
  }
  return this.save();
};

// Method to add comment
forumPostSchema.methods.addComment = function(authorId, content) {
  this.comments.push({
    author: authorId,
    content
  });
  return this.save();
};

// Method to increment views
forumPostSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

forumPostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('ForumPost', forumPostSchema); 