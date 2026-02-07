const express = require('express');
const router = express.Router();
const Conversation = require('../model/conversation');
const Message = require('../model/message');
const auth = require('../middleware/auth');

// Get all conversations for logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user.id
        })
            .populate('participants', 'username avatar')
            .sort({ lastMessageTime: -1 });

        res.status(200).json(conversations);
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Start or get existing conversation with another user
router.post('/start/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params;

        if (userId === req.user.id) {
            return res.status(400).json({ message: 'Cannot start conversation with yourself' });
        }

        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            participants: { $all: [req.user.id, userId] }
        }).populate('participants', 'username avatar');

        // Create new conversation if doesn't exist
        if (!conversation) {
            conversation = new Conversation({
                participants: [req.user.id, userId]
            });
            await conversation.save();
            await conversation.populate('participants', 'username avatar');
        }

        res.status(200).json(conversation);
    } catch (error) {
        console.error('Start conversation error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get messages in a conversation
router.get('/:conversationId/messages', auth, async (req, res) => {
    try {
        const { conversationId } = req.params;

        // Verify user is part of conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (!conversation.participants.includes(req.user.id)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const messages = await Message.find({ conversation: conversationId })
            .populate('sender', 'username avatar')
            .populate('receiver', 'username avatar')
            .sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Send a message
router.post('/:conversationId/messages', auth, async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Message content is required' });
        }

        // Verify conversation exists and user is participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (!conversation.participants.includes(req.user.id)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Get receiver ID (the other participant)
        const receiverId = conversation.participants.find(
            id => id.toString() !== req.user.id
        );

        // Create message
        const message = new Message({
            conversation: conversationId,
            sender: req.user.id,
            receiver: receiverId,
            content: content.trim()
        });

        await message.save();
        await message.populate('sender', 'username avatar');
        await message.populate('receiver', 'username avatar');

        // Update conversation's last message
        conversation.lastMessage = content.trim().substring(0, 50);
        conversation.lastMessageTime = new Date();
        await conversation.save();

        res.status(201).json(message);
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Mark messages as read
router.put('/messages/:messageId/read', auth, async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Only receiver can mark as read
        if (message.receiver.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        message.read = true;
        await message.save();

        res.status(200).json({ message: 'Message marked as read' });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
