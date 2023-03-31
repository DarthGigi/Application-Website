import type { Session } from '$lib/server/types/database';
import mongoose, { Schema } from 'mongoose';

const schema = new Schema<Session>(
  {
    _id: { type: String, required: true },
    ExpiresAt: { type: Number, required: true },
    UserID: { type: String, required: true }
  },
  { versionKey: false }
);

export default mongoose.connection.models.sessions || mongoose.connection.model('sessions', schema);
