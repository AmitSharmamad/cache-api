import * as mongoose from 'mongoose';
import { MONGO_DB_CONNECTION_URL } from '../env';
import { DATABASE_CONNECTION } from './database.constants';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(MONGO_DB_CONNECTION_URL),
  },
];
