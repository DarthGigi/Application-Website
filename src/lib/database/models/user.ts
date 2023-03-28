import { Schema } from 'mongoose';
import { Connection } from '..';

export interface User {
  _id: string;
  username: string;
  password: string;
  admin: boolean;
}

const schema = new Schema<User>(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true }
  },
  { versionKey: false }
);

export const Users = Connection.Mongoose.model('users', schema);
