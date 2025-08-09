const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  tags: [{ type: String }],
  jsonFileUrl: { type: String },
  status: { type: String, enum: ['draft','published'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

sessionSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('Session', sessionSchema);
