import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { NehnutelnostType, NehnutelnostState } from './nehnutelnost.enum';

export type NehnutelnostDocument = HydratedDocument<Nehnutelnost>;

@Schema({ timestamps: true, collection: 'realities' })
export class Nehnutelnost {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  desc: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({
    type: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      postalCode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
      houseNumber: { type: String, trim: true },
      apartment: { type: String, trim: true },
    },
    required: true,
    _id: false,
  })
  location: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    houseNumber?: string;
    apartment?: string;
  };

  @Prop({ required: true, enum: ['predaj', 'prenajom'] })
  state: string;

  @Prop({ required: true, min: 0 })
  area: number;

  @Prop({ required: true, enum: ['byt', 'dom', 'pozemok'] })
  type: string;

  // Voliteľné polia pre byt/dom
  @Prop({ required: false, min: 0 })
  rooms?: number;

  @Prop({ required: false, min: 0 })
  bathrooms?: number;

  @Prop({ required: false, default: false })
  hasGarage?: boolean;

  @Prop({ required: false, default: false })
  hasBalcony?: boolean;

  @Prop({ required: false, default: false })
  hasTerrace?: boolean;

  @Prop({ required: false, default: false })
  hasElevator?: boolean;

  @Prop({ required: false, min: 0 })
  floor?: number;

  @Prop({ required: false, min: 0 })
  totalFloors?: number;

  @Prop({ required: false, min: 1900 })
  constructionYear?: number;

  @Prop({ required: false, min: 1900 })
  renovationYear?: number;

  @Prop({ required: false })
  energyClass?: string;

  @Prop({ required: false })
  heatingType?: string;

  @Prop({ required: false })
  condition?: string;

  @Prop({ required: false })
  landType?: string;

  @Prop({ required: false, default: false })
  isFenced?: boolean;

  @Prop({ required: false, default: false })
  hasUtilities?: boolean;

  @Prop({ required: false, type: [String] })
  utilitiesTypes?: string[];

  @Prop({ required: false })
  terrainType?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  author: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: [] })
  images: string[];
}

export const NehnutelnostSchema = SchemaFactory.createForClass(Nehnutelnost);

NehnutelnostSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    // delete ret._id;
    delete ret.__v;
    return ret;
  },
});
