import mongoose, { disconnect, ConnectionStates } from 'mongoose';
import { MONGO_URI } from '$env/static/private';

export const Connection = {
  Mongoose: mongoose
};

interface connectionTracker {
  status: ConnectionStates;
}
export const connectionStatus: connectionTracker = {
  status: ConnectionStates.uninitialized
};

export const connectToDB = async () => {
  const Start = new Date().getTime();
  if (connectionStatus.status == ConnectionStates.connected) {
    throw Error('Mongoose is already connected');
  }
  if (mongoose.connections.length > 0) {
    connectionStatus.status = mongoose.connections[0].readyState;
    if (connectionStatus.status == ConnectionStates.connected) {
      throw Error('There is already a connected instance');
    }
    await disconnect();
  }
  connectionStatus.status = ConnectionStates.connecting;
  const con = await mongoose.connect(MONGO_URI, { keepAlive: true, keepAliveInitialDelay: 300000 });
  connectionStatus.status = ConnectionStates.connected;
  // successfully connected!
  Connection.Mongoose = con;
  console.log(`Sucessfully connected to Database in ${new Date().getTime() - Start}ms!`);
};

export const disconnectFromDB = async () => {
  const startTime = new Date().getTime();
  if (connectionStatus.status != ConnectionStates.connected) throw Error('Not connected to database.');
  connectionStatus.status = ConnectionStates.disconnecting;

  await mongoose.disconnect();
  connectionStatus.status = ConnectionStates.disconnected;
  console.log(`Disconnected from the database in ${new Date().getTime() - startTime} ms.`);
};
