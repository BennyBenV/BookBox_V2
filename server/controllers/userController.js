const User = require('../models/User');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('followers', 'username')
            .populate('following', 'username');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search users by username
// @route   GET /api/users/search?q=username
// @access  Private
const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return res.json([]);
        }

        const users = await User.find({
            username: { $regex: q, $options: 'i' },
            _id: { $ne: req.user.id } // Exclude current user
        })
            .select('username createdAt')
            .limit(10);

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
const followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.params.id === req.user.id) {
            return res.status(400).json({ message: 'Cannot follow yourself' });
        }

        // Check if already following
        const alreadyFollowing = currentUser.following.some(
            id => id.toString() === req.params.id
        );

        if (alreadyFollowing) {
            return res.status(400).json({ message: 'Already following this user' });
        }

        // Add to following/followers
        currentUser.following.push(req.params.id);
        userToFollow.followers.push(req.user.id);

        await Promise.all([currentUser.save(), userToFollow.save()]);

        res.json({ message: 'User followed successfully' });
    } catch (error) {
        console.error('Follow error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Unfollow a user
// @route   DELETE /api/users/:id/follow
// @access  Private
const unfollowUser = async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToUnfollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove from following/followers using $pull
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { following: req.params.id }
        });

        await User.findByIdAndUpdate(req.params.id, {
            $pull: { followers: req.user.id }
        });

        res.json({ message: 'User unfollowed successfully' });
    } catch (error) {
        console.error('Unfollow error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's followers
// @route   GET /api/users/:id/followers
// @access  Private
const getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('followers', 'username createdAt');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.followers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's following
// @route   GET /api/users/:id/following
// @access  Private
const getFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('following', 'username createdAt');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.following);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's public library
// @route   GET /api/users/:id/library
// @access  Private
const getUserLibrary = async (req, res) => {
    try {
        const Book = require('../models/Book');
        const books = await Book.find({ user: req.params.id })
            .sort({ dateAdded: -1 })
            .limit(20);

        res.json(books);
    } catch (error) {
        console.error('Get user library error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get aggregated feed from followed users
// @route   GET /api/users/feed
// @access  Private
const getUserFeed = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const followingIds = currentUser.following;

        const Book = require('../models/Book');
        const books = await Book.find({ user: { $in: followingIds } })
            .sort({ dateAdded: -1 })
            .limit(50)
            .populate('user', 'username');

        res.json(books);
    } catch (error) {
        console.error('Get user feed error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserProfile,
    searchUsers,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getUserLibrary,
    getUserFeed
};
