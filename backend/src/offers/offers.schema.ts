// src/offers/offer.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OfferDocument = HydratedDocument<Offer>;

@Schema({ timestamps: true })
export class Offer {
  @Prop({
    type: Types.ObjectId,
    ref: 'Nehnutelnost',
    required: true,
    index: true,
  })
  nehnutelnost: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  buyer: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ trim: true, default: '' })
  comment: string;

  @Prop({ enum: ['pending', 'accepted', 'rejected'], default: 'pending' })
  status: string;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
