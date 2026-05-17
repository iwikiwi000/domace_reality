import { z } from 'zod';

export const CreateOfferSchema = z.object({
  amount: z.coerce.number().positive('Suma musí byť kladné číslo'),
  comment: z.string().max(500).optional(),
});

export type CreateOfferDto = z.infer<typeof CreateOfferSchema>;
