const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.js');
const Session = require('../models/Session.js');

router.get('/', async (req, res) => {
  const sessions = await Session.find({ status: 'published' }).sort({ updatedAt: -1 });
  res.json(sessions);
});

router.get('/my-sessions', auth, async (req, res) => {
  const sessions = await Session.find({ user: req.userId }).sort({ updatedAt: -1 });
  res.status(200).json(sessions);
});

router.get('/my-sessions/:id', auth, async (req, res) => {
  const session = await Session.findOne({ _id: req.params.id, user: req.userId });
  if (!session) return res.status(404).json({ message: 'Not found' });
  res.status(200).json(session);
});

// save or update draft
router.post('/my-sessions/save-draft', auth, async (req, res) => {
  const { id, title, tags, jsonFileUrl } = req.body;
  if (id) {
    const s = await Session.findOneAndUpdate(
      { _id: id, user: req.userId },
      { title, tags, jsonFileUrl, status: 'draft', updatedAt: Date.now() },
      { new: true }
    );
    return res.status(200).json(s);
  } else {
    const s = await Session.create({ user: req.userId, title, tags, jsonFileUrl, status: 'draft' });
    return res.status(200).json(s);
  }
});

router.post('/my-sessions/publish', auth, async (req, res) => {
  const { id, title, tags, jsonFileUrl } = req.body;
  if (id) {
    const s = await Session.findOneAndUpdate(
      { _id: id, user: req.userId },
      { title, tags, jsonFileUrl, status: 'published', updatedAt: Date.now() },
      { new: true }
    );
    return res.status(200).json(s);
  } else {
    const s = await Session.create({ user: req.userId, title, tags, jsonFileUrl, status: 'published' });
    return res.status(200).json(s);
  }
});

module.exports = router;
