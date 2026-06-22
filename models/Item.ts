// C:\Users\Administrator\Desktop\linkchemtwo\models\Item.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  name: string;
  description: string;
  images: {
    url: string;
    public_id: string;
    format: string;
    size: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
        format: {
          type: String,
        },
        size: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Check if model exists before creating a new one
const Item = mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);

export default Item;