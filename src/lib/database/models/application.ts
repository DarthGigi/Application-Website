import { Schema, model } from 'mongoose';
import { Connection } from '..';

export interface FormResponses {
  Usage: string;
  Discovery: string;
  Questions: string[];
}

export interface FormAgreements {
  Staff: boolean;
  Info: boolean;
}

export enum ApplicationStatus {
  PENDING = 0,
  DENIED,
  ACCEPTED
}

export interface Application {
  _id: string;
  name: string;
  email: string;
  discordID: string;
  responses: FormResponses | string;
  agreements: FormAgreements | string;
  IP: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<Application>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    discordID: { type: String, required: true },
    responses: { type: String, required: true },
    agreements: { type: String, required: true },
    IP: { type: String, required: true },
    status: { type: Number, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: false }
  },
  { versionKey: false }
);

export const Applications = Connection.Mongoose.model('applications', schema);
