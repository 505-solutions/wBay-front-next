import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Image = mongoose.models.Image || mongoose.model('Image', ImageSchema); 