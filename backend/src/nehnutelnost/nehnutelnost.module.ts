import { NehnutelnostController } from './nehnutelnost.controller';
import { NehnutelnostService } from './nehnutelnost.service';
import { UsersService } from 'src/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { Nehnutelnost, NehnutelnostSchema } from './nehnutelnost.schema';
import { Module, OnModuleInit } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Nehnutelnost.name, schema: NehnutelnostSchema },
    ]),
    UsersModule,
  ],
  controllers: [NehnutelnostController],
  providers: [NehnutelnostService],
  exports: [NehnutelnostService],
})
export class NehnutelnostModule implements OnModuleInit {
  constructor(
    private readonly nehnutelnostService: NehnutelnostService,
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit() {
    const addSampleNehnutelnost = async () => {
      const defaultNehnutelnosti = [
        {
          title: 'Moderný 3-izbový byt v centre',
          desc: '3-izbový byt po kompletnej rekonštrukcii s balkónom a parkovacím miestom.',
          price: 189000,
          location: {
            street: 'Hlavná',
            city: 'Bratislava',
            postalCode: '81101',
            country: 'Slovensko',
            houseNumber: '25',
            apartment: '12',
          },
          state: 'predaj' as const,
          area: 78,
          type: 'byt' as const,
          rooms: 3,
          bathrooms: 1,
          hasBalcony: true,
        },
        {
          title: 'Rodinný dom s veľkou záhradou',
          desc: 'Priestranný rodinný dom s 5 izbami, garážou a záhradou 800m².',
          price: 320000,
          location: {
            street: 'Záhradná',
            city: 'Košice',
            postalCode: '04001',
            country: 'Slovensko',
            houseNumber: '15',
          },
          state: 'predaj' as const,
          area: 180,
          type: 'dom' as const,
          rooms: 5,
          bathrooms: 2,
          hasGarage: true,
          hasTerrace: true,
        },
        {
          title: 'Útulný 1-izbový byt na prenájom',
          desc: 'Zariadený 1-izbový byt blízko centra, MHD 5 minút pešo.',
          price: 650,
          location: {
            street: 'Sladkovičova',
            city: 'Žilina',
            postalCode: '01001',
            country: 'Slovensko',
            houseNumber: '8',
            apartment: '5',
          },
          state: 'prenajom' as const,
          area: 38,
          type: 'byt' as const,
          rooms: 1,
          bathrooms: 1,
        },
        {
          title: 'Stavebný pozemok pri lese',
          desc: 'Rovinatý stavebný pozemok s IS na hranici pozemku, krásny výhľad.',
          price: 85000,
          location: {
            street: 'Pod lesom',
            city: 'Banská Bystrica',
            postalCode: '97401',
            country: 'Slovensko',
            houseNumber: '0',
          },
          state: 'predaj' as const,
          area: 650,
          type: 'pozemok' as const,
          landType: 'stavebný',
          isFenced: false,
          hasUtilities: true,
          terrainType: 'rovinný',
        },
      ];

      const users = await this.usersService.findAll();
      if (users.length === 0) return;

      const nehnutelnosti = await this.nehnutelnostService.findAll();
      if (nehnutelnosti.length === 0) {
        for (const nehnutelnost of defaultNehnutelnosti) {
          await this.nehnutelnostService.create(users[0].id, nehnutelnost);
          console.log(`Created: ${nehnutelnost.title}`);
        }
        console.log('Sample nehnutelnosti created successfully');
      } else {
        console.log('Nehnutelnosti already exist, skipping seed');
      }
    };

    setTimeout(() => {
      addSampleNehnutelnost();
    }, 2000);
  }
}
