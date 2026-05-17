// src/offers/offers.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Offer, OfferDocument } from './offers.schema';
import type { CreateOfferDto } from './offers.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
  ) {}

  async create(nehnutelnostId: string, buyerId: string, data: CreateOfferDto) {
    const offer = new this.offerModel({
      nehnutelnost: new Types.ObjectId(nehnutelnostId),
      buyer: new Types.ObjectId(buyerId),
      amount: data.amount,
      comment: data.comment ?? '',
    });
    await offer.save();
    return this.offerModel
      .findById(offer._id)
      .populate('buyer', 'name email')
      .populate('nehnutelnost', 'title price')
      .lean();
  }

  // Ponuky ktoré som odoslal ja
  async findByBuyer(buyerId: string) {
    return this.offerModel
      .find({ buyer: new Types.ObjectId(buyerId) })
      .populate('nehnutelnost', 'title price images')
      .sort({ createdAt: -1 })
      .lean();
  }

  // Ponuky prijaté na moje nehnuteľnosti
  async findReceived(authorId: string) {
    return this.offerModel
      .find()
      .populate({
        path: 'nehnutelnost',
        match: { author: new Types.ObjectId(authorId) },
        select: 'title price images',
      })
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 })
      .lean()
      .then((offers) => offers.filter((o) => o.nehnutelnost !== null));
  }

  // Admin – všetky ponuky
  async findAll() {
    return this.offerModel
      .find()
      .populate('nehnutelnost', 'title price')
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 })
      .lean();
  }
}
