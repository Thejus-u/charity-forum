const express = require('express');
const { body, validationResult } = require('express-validator');
const ForumPost = require('../models/ForumPost');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/forum
// @desc    Create a new forum post
// @access  Private
router.post('/', auth, [
  body('title')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('content')
    .isLength({ min: 20, max: 10000 })
    .withMessage('Content must be between 20 and 10000 characters'),
  body('category')
    .isIn(['general', 'donation-stories', 'volunteering', 'fundraising', 'community', 'news', 'help'])
    .withMessage('Invalid category'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('relatedDonation')
    .optional()
    .isMongoId()
    .withMessage('Invalid donation ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category, tags = [], relatedDonation } = req.body;

    const post = new ForumPost({
      title,
      content,
      category,
      tags,
      relatedDonation,
      author: req.user._id
    });

    await post.save();

    // Update user's total posts
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalPosts: 1 }
    });

    // Populate author info
    await post.populate('author', 'username firstName lastName avatar');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/forum
// @desc    Get all forum posts with filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      author
    } = req.query;

    const query = { status: 'active' };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by author
    if (author) {
      query.author = author;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
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
        { path: 'author', select: 'username firstName lastName avatar' },
        { path: 'comments.author', select: 'username firstName lastName avatar' },
        { path: 'relatedDonation', select: 'title' }
      ]
    };

    const posts = await ForumPost.paginate(query, options);

    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/forum/:id
// @desc    Get a specific forum post
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'username firstName lastName avatar bio')
      .populate('comments.author', 'username firstName lastName avatar')
      .populate('relatedDonation', 'title description image')
      .populate('likes', 'username firstName lastName avatar')
      .populate('dislikes', 'username firstName lastName avatar');

    if (!post || post.status === 'deleted') {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment views if user is authenticated
    if (req.user) {
      post.incrementViews();
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/forum/:id
// @desc    Update a forum post
// @access  Private (author only)
router.put('/:id', auth, [
  body('title')
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('content')
    .optional()
    .isLength({ min: 20, max: 10000 })
    .withMessage('Content must be between 20 and 10000 characters'),
  body('category')
    .optional()
    .isIn(['general', 'donation-stories', 'volunteering', 'fundraising', 'community', 'news', 'help'])
    .withMessage('Invalid category'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const updateFields = {};
    const { title, content, category, tags } = req.body;

    if (title) updateFields.title = title;
    if (content) updateFields.content = content;
    if (category) updateFields.category = category;
    if (tags) updateFields.tags = tags;

    const updatedPost = await ForumPost.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('author', 'username firstName lastName avatar');

    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/forum/:id
// @desc    Delete a forum post
// @access  Private (author only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Soft delete
    post.status = 'deleted';
    await post.save();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/forum/:id/like
// @desc    Like a forum post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.addLike(req.user._id);

    res.json({
      message: 'Post liked successfully',
      likeCount: post.likes.length,
      dislikeCount: post.dislikes.length
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/forum/:id/dislike
// @desc    Dislike a forum post
// @access  Private
router.post('/:id/dislike', auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.addDislike(req.user._id);

    res.json({
      message: 'Post disliked successfully',
      likeCount: post.likes.length,
      dislikeCount: post.dislikes.length
    });
  } catch (error) {
    console.error('Dislike post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/forum/:id/comments
// @desc    Add a comment to a forum post
// @access  Private
router.post('/:id/comments', auth, [
  body('content')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Comment must be between 1 and 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.isLocked) {
      return res.status(400).json({ message: 'This post is locked and cannot receive new comments' });
    }

    await post.addComment(req.user._id, content);

    // Populate the updated post
    await post.populate('author', 'username firstName lastName avatar');
    await post.populate('comments.author', 'username firstName lastName avatar');

    res.json({
      message: 'Comment added successfully',
      post
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/forum/:id/comments/:commentId
// @desc    Update a comment
// @access  Private (comment author only)
router.put('/:id/comments/:commentId', auth, [
  body('content')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Comment must be between 1 and 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.content = content;
    comment.isEdited = true;
    comment.editedAt = new Date();

    await post.save();

    // Populate the updated post
    await post.populate('author', 'username firstName lastName avatar');
    await post.populate('comments.author', 'username firstName lastName avatar');

    res.json({
      message: 'Comment updated successfully',
      post
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/forum/:id/comments/:commentId
// @desc    Delete a comment
// @access  Private (comment author or post author only)
router.delete('/:id/comments/:commentId', auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author or post author
    const isCommentAuthor = comment.author.toString() === req.user._id.toString();
    const isPostAuthor = post.author.toString() === req.user._id.toString();

    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.remove();
    await post.save();

    // Populate the updated post
    await post.populate('author', 'username firstName lastName avatar');
    await post.populate('comments.author', 'username firstName lastName avatar');

    res.json({
      message: 'Comment deleted successfully',
      post
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/forum/categories
// @desc    Get forum categories
// @access  Public
router.get('/categories', (req, res) => {
  const categories = [
    { value: 'general', label: 'General Discussion', icon: '💬' },
    { value: 'donation-stories', label: 'Donation Stories', icon: '❤️' },
    { value: 'volunteering', label: 'Volunteering', icon: '🤝' },
    { value: 'fundraising', label: 'Fundraising Tips', icon: '💰' },
    { value: 'community', label: 'Community Events', icon: '🎉' },
    { value: 'news', label: 'News & Updates', icon: '📰' },
    { value: 'help', label: 'Help & Support', icon: '❓' }
  ];

  res.json(categories);
});

module.exports = router; 