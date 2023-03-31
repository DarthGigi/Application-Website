import type { User } from '$lib/server/types/database';
import mongoose, { Schema } from 'mongoose';

const schema = new Schema<User>(
  {
    _id: { type: String, required: true },
    discord: { type: Object, required: true },
    reviewer: { type: Boolean, required: true }
  },
  { versionKey: false }
);

export const Users = mongoose.connection.model('users', schema);
