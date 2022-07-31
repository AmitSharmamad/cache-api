import { Schema } from 'mongoose';
import { CACHE_EXPIRY_TIME } from '../env';

export const CacheAPISchema: Schema = new Schema(
  {
    key: String,
    value: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

CacheAPISchema.index({ createdAt: 1 }, { expires: CACHE_EXPIRY_TIME });

// this is to only get rid of "_id"
// this should not be done if "_id" is used for update purposes
CacheAPISchema.set('toObject', {
  transform: function (doc, ret) {
    // ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
