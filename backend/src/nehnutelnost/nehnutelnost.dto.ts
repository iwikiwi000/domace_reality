import { z } from 'zod';

export const LocationSchema = z.object({
  street: z.string().min(1, 'Ulica je povinná'),
  houseNumber: z.string().optional(),
  apartment: z.string().optional(),
  city: z.string().min(1, 'Mesto je povinné'),
  postalCode: z.string().min(1, 'PSČ je povinné'),
  country: z.string().min(1, 'Krajina je povinná'),
});

const toBoolean = (val: unknown): boolean | unknown => {
  if (val === 'true') return true;
  if (val === 'false') return false;
  return val;
};

const parseJson = (val: unknown): unknown => {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
};

export const NehnutelnostCreateSchema = z.object({
  title: z.string().min(2, 'title min. 2 znaky'),
  desc: z.string().min(2, 'desc min. 2 znaky'),
  price: z.coerce.number().positive('price musí byť kladné'),
  state: z.enum(['predaj', 'prenajom']),
  area: z.coerce.number().positive('area musí byť kladné'),
  type: z.enum(['byt', 'dom', 'pozemok']),
  location: z.preprocess(parseJson, LocationSchema),

  rooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  hasGarage: z.preprocess(toBoolean, z.boolean().optional()),
  hasBalcony: z.preprocess(toBoolean, z.boolean().optional()),
  hasTerrace: z.preprocess(toBoolean, z.boolean().optional()),
  hasElevator: z.preprocess(toBoolean, z.boolean().optional()),
  floor: z.coerce.number().min(0).optional(),
  totalFloors: z.coerce.number().min(0).optional(),
  constructionYear: z.coerce
    .number()
    .min(1900)
    .max(new Date().getFullYear())
    .optional(),
  renovationYear: z.coerce.number().min(1900).optional(),
  energyClass: z.string().optional(),
  heatingType: z.string().optional(),
  condition: z.string().optional(),
  landType: z.string().optional(),
  isFenced: z.preprocess(toBoolean, z.boolean().optional()),
  hasUtilities: z.preprocess(toBoolean, z.boolean().optional()),
  utilitiesTypes: z.array(z.string()).optional(),
  terrainType: z.string().optional(),
});

export const NehnutelnostUpdateSchema = NehnutelnostCreateSchema.partial();

export type NehnutelnostCreateDto = z.infer<typeof NehnutelnostCreateSchema>;
export type NehnutelnostUpdateDto = z.infer<typeof NehnutelnostUpdateSchema>;
export type LocationDto = z.infer<typeof LocationSchema>;
