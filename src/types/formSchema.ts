import { z } from 'zod';
import { generateRankOptions } from '../utils/ranks';

export const serverOptions = ['NA', 'EUW', 'EUE', 'KR'] as const;

const rankOptions = generateRankOptions();

export const summonerFormSchema = z.object({
  summonerName: z.string().min(3).max(16),
  tag: z.string().min(3).max(5),
  server: z.enum(serverOptions),
  goalRank: z
    .string()
    .refine(val => rankOptions.some(opt => opt.label === val), {
      message: 'Please select a valid rank',
    }),
});

export type SummonerFormData = z.infer<typeof summonerFormSchema>;
