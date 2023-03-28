import { Schema } from 'mongoose';
import { Connection } from '..';

export interface Secret {
  _id: string;
  Secret: string;
  CreatedAt: Date;
  CreatedBy: string;
  GiveAdmin: boolean;
  //IP: string;
}

const schema = new Schema<Secret>(
  {
    _id: { type: String, required: true },
    CreatedBy: { type: String, required: true },
    Secret: { type: String, required: true },
    CreatedAt: { type: Date, required: true },
    GiveAdmin: { type: Boolean, required: true }
  },
  { versionKey: false }
);

export const Secrets = Connection.Mongoose.model('secrets', schema);
