import { Schema } from 'mongoose';
import mongoose from 'mongoose';
import type { Application } from '$lib/types/application';

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

export default mongoose.connection.models.applications || mongoose.connection.model('applications', schema);
