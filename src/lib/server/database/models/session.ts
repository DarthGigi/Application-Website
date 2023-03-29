import mongoose, { Schema } from 'mongoose';

export interface Session {
  _id: string;
  UserID: string;
  ExpiresAt: number;
  //IP: string;
}

const schema = new Schema<Session>(
  {
    _id: { type: String, required: true },
    ExpiresAt: { type: Number, required: true },
    //IP: { type: String, required: true },
    UserID: { type: String, required: true }
  },
  { versionKey: false }
);

export const Sessions = mongoose.connection.model('sessions', schema);
