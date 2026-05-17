import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { NehnutelnostDocument, Nehnutelnost } from './nehnutelnost.schema';
import type {
  NehnutelnostCreateDto,
  NehnutelnostUpdateDto,
} from './nehnutelnost.dto';
import * as fs from 'fs';

@Injectable()
export class NehnutelnostService {
  constructor(
    @InjectModel(Nehnutelnost.name)
    private nehnutelnostModel: Model<NehnutelnostDocument>,
    private readonly users: UsersService,
  ) {}

  async findAll() {
    return this.nehnutelnostModel
      .find({ isActive: true })
      .populate('author', 'email name')
      .sort({ updatedAt: -1 });
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid nehnutelnost ID format: ${id}`);
    }

    const doc = await this.nehnutelnostModel
      .findById(id)
      .populate('author', 'email name')
      .lean();

    if (!doc) {
      throw new NotFoundException(`Nehnuteľnosť s ID ${id} nebola nájdená`);
    }
    return doc;
  }

  async create(
    authorId: string,
    data: NehnutelnostCreateDto,
    imageUrls: string[] = [],
  ) {
    if (!Types.ObjectId.isValid(authorId))
      throw new BadRequestException('Invalid authorId');

    // Overenie že používateľ existuje
    await this.users.findById(authorId);

    const doc = new this.nehnutelnostModel({
      ...data,
      author: new Types.ObjectId(authorId),
      images: imageUrls,
    });

    await doc.save();
    return this.findById(doc._id.toString());
  }

  async update(
    id: string,
    data: NehnutelnostUpdateDto,
    imageUrls: string[] = [],
    imagesToDelete: string[] = [],
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid nehnutelnost ID format: ${id}`);
    }

    const updateData: Record<string, any> = { ...data };
    const updateOperations: any = { $set: updateData };

    if (imageUrls.length > 0) {
      updateOperations.$push = { images: { $each: imageUrls } };
    }

    if (imagesToDelete.length > 0) {
      updateOperations.$pull = { images: { $in: imagesToDelete } };
    }

    const doc = await this.nehnutelnostModel
      .findByIdAndUpdate(id, updateOperations, { new: true })
      .populate('author', 'email name')
      .lean();

    if (!doc) throw new NotFoundException('Nehnuteľnosť nebola nájdená');
    return doc;
  }

  async updateOwned(id: string, userId: string, data: NehnutelnostUpdateDto) {
    const nehnutelnost = await this.nehnutelnostModel.findById(id);
    if (!nehnutelnost)
      throw new NotFoundException('Nehnuteľnosť nebola nájdená');
    if (nehnutelnost.author.toString() !== userId)
      throw new ForbiddenException('Nemôžete upravovať cudziu nehnuteľnosť');

    Object.assign(nehnutelnost, data);
    await nehnutelnost.save();

    return this.nehnutelnostModel
      .findById(id)
      .populate('author', 'email name')
      .lean();
  }

  async remove(id: string, userId: string, role: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid nehnutelnost ID format: ${id}`);
    }

    const doc = await this.nehnutelnostModel.findById(id);
    if (!doc) throw new NotFoundException('Nehnuteľnosť nebola nájdená');

    const isOwner = doc.author.toString() === userId;
    const isAdmin = role === 'admin';
    if (!isOwner && !isAdmin) throw new ForbiddenException();

    await this.nehnutelnostModel.findByIdAndDelete(id);
    return { success: true };
  }

  // nehnutelnost.service.ts - opravená updateWithAuth metóda
  async updateWithAuth(
    id: string,
    userId: string,
    role: string,
    data: NehnutelnostUpdateDto,
    imageUrls: string[] = [],
    imagesToDelete: string[] = [],
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid nehnutelnost ID format: ${id}`);
    }

    // Najprv skontroluj existenciu a práva
    const existingDoc = await this.nehnutelnostModel.findById(id);
    if (!existingDoc) {
      throw new NotFoundException('Nehnuteľnosť nebola nájdená');
    }

    const isOwner = existingDoc.author.toString() === userId;
    const isAdmin = role?.toLowerCase() === 'admin';
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'Nemáte oprávnenie upravovať túto nehnuteľnosť',
      );
    }

    const cleanUpdateData: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        cleanUpdateData[key] = value;
      }
    }

    // Pridaj nové obrázky
    if (imagesToDelete.length > 0) {
      await this.nehnutelnostModel.findByIdAndUpdate(id, {
        $pull: { images: { $in: imagesToDelete } },
      });

      // Fyzicky zmaž súbory z disku
      for (const imgPath of imagesToDelete) {
        const fullPath = `.${imgPath}`;
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    }

    // Spusti update
    const updateOperations: any = { $set: cleanUpdateData };
    if (imageUrls.length > 0) {
      updateOperations.$push = { images: { $each: imageUrls } };
    }

    const updatedDoc = await this.nehnutelnostModel
      .findByIdAndUpdate(id, updateOperations, { new: true })
      .populate('author', 'email name')
      .lean();

    if (!updatedDoc) {
      throw new NotFoundException('Nehnuteľnosť nebola nájdená');
    }

    return updatedDoc;
  }

  // Nová metóda na vyhľadávanie podľa autora
  async findByAuthor(authorId: string) {
    if (!Types.ObjectId.isValid(authorId)) {
      throw new BadRequestException(`Invalid author ID format: ${authorId}`);
    }

    return this.nehnutelnostModel
      .find({ author: new Types.ObjectId(authorId), isActive: true })
      .populate('author', 'email name')
      .sort({ createdAt: -1 })
      .lean();
  }
}
