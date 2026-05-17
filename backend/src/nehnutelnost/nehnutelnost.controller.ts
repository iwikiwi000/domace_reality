import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { NehnutelnostService } from './nehnutelnost.service';
import { CurrentUser, type JwtUser } from 'src/auth/current-user.decorator';
import {
  NehnutelnostCreateSchema,
  NehnutelnostUpdateSchema,
} from './nehnutelnost.dto';
import type {
  NehnutelnostCreateDto,
  NehnutelnostUpdateDto,
} from './nehnutelnost.dto';
import { ZodPipe } from 'src/core/zod.pipe';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { Public } from 'src/auth/public.decorator';
import { extname } from 'path';
import sharp from 'sharp';
import * as fs from 'fs';

const imagesUploadInterceptor = FilesInterceptor('images', 10, {
  storage: diskStorage({
    destination: './uploads',
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `temp-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Len obrázky sú povolené'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

@Controller('nehnutelnosti')
export class NehnutelnostController {
  constructor(private readonly nehnutelnosti: NehnutelnostService) {}

  @Get()
  @Public()
  getAll() {
    return this.nehnutelnosti.findAll();
  }

  @Get(':id')
  @Public()
  getById(@Param('id') id: string) {
    return this.nehnutelnosti.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.nehnutelnosti.remove(id, user.userId, user.role);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(imagesUploadInterceptor)
  async create(
    @CurrentUser() user: JwtUser,
    @Body(new ZodPipe(NehnutelnostCreateSchema)) body: NehnutelnostCreateDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const imagesUrls: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const webpFilename = file.filename
            .replace(/^temp-/, 'nehnutelnost-')
            .replace(/\.[^/.]+$/, '.webp');
          const webpPath = `./uploads/${webpFilename}`;

          await sharp(file.path)
            .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(webpPath);

          fs.unlinkSync(file.path);

          imagesUrls.push(`/uploads/${webpFilename}`);
        } catch (err) {
          console.error('Chyba pri konverzii obrázka:', err);
          imagesUrls.push(`/uploads/${file.filename}`);
        }
      }
    }

    console.log('Received body:', JSON.stringify(body, null, 2));
    console.log('Received files:', files?.length || 0);
    console.log('Converted images:', imagesUrls);

    return this.nehnutelnosti.create(user.userId, body, imagesUrls);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(imagesUploadInterceptor)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async update(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
    @Body(new ZodPipe(NehnutelnostUpdateSchema)) body: NehnutelnostUpdateDto,
    @UploadedFiles() files?: Express.Multer.File[],
    @Body('imagesToDelete') imagesToDelete?: string,
  ) {
    console.log('RAW body keys:', Object.keys(body));
    console.log('Files count:', files?.length ?? 0);
    console.log('Update body received:', JSON.stringify(body, null, 2));
    console.log('Update files:', files?.length || 0);
    console.log('Images to delete:', imagesToDelete);

    const imageUrls: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const webpFilename = file.filename
            .replace(/^temp-/, 'nehnutelnost-')
            .replace(/\.[^/.]+$/, '.webp');
          const webpPath = `./uploads/${webpFilename}`;

          await sharp(file.path)
            .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(webpPath);

          fs.unlinkSync(file.path);
          imageUrls.push(`/uploads/${webpFilename}`);
        } catch (err) {
          console.error('Chyba pri konverzii obrázka:', err);
          imageUrls.push(`/uploads/${file.filename}`);
        }
      }
    }

    const toDelete = imagesToDelete ? JSON.parse(imagesToDelete) : [];
    console.log('Image URLs to add:', imageUrls);
    console.log('Images to delete from DB:', toDelete);

    const result = await this.nehnutelnosti.updateWithAuth(
      id,
      user.userId,
      user.role,
      body,
      imageUrls,
      toDelete,
    );

    console.log('Update result:', result);
    return result;
  }
}
