const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.js');
const Session = require('../models/Session.js');

// Public: list published sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'published' }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sessions of the logged-in user
router.get('/my-sessions', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.userId }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single session (owned)
router.get('/my-sessions/:id', auth, async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.userId });
    if (!session) return res.status(404).json({ message: 'Not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save or update draft (autosave & manual Save Draft)
router.post('/my-sessions/save-draft', auth, async (req, res) => {
  try {
    const { id, title, tags, jsonFileUrl } = req.body;
    if (id) {
      const s = await Session.findOneAndUpdate(
        { _id: id, user: req.userId },
        { title, tags: tags || [], jsonFileUrl: jsonFileUrl || '', status: 'draft', updatedAt: Date.now() },
        { new: true }
      );
      if (!s) return res.status(404).json({ message: 'Not found' });
      return res.json(s);
    } else {
      const s = await Session.create({ user: req.userId, title: title || 'Untitled session', tags: tags || [], jsonFileUrl: jsonFileUrl || '', status: 'draft' });
      return res.status(201).json(s);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Publish (creates or updates)
router.post('/my-sessions/publish', auth, async (req, res) => {
  try {
    const { id, title, tags, jsonFileUrl } = req.body;
    if (id) {
      const s = await Session.findOneAndUpdate(
        { _id: id, user: req.userId },
        { title, tags: tags || [], jsonFileUrl: jsonFileUrl || '', status: 'published', updatedAt: Date.now() },
        { new: true }
      );
      if (!s) return res.status(404).json({ message: 'Not found' });
      return res.json(s);
    } else {
      const s = await Session.create({ user: req.userId, title: title || 'Untitled session', tags: tags || [], jsonFileUrl: jsonFileUrl || '', status: 'published' });
      return res.status(201).json(s);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
