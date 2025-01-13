import { z } from 'zod';

export const serverOptions = ['NA', 'EUW', 'KR'] as const;

export const summonerFormSchema = z.object({
  summonerName: z.string().min(1, 'Summoner name is required'),
  tag: z
    .string()
    .min(1, 'Tag is required')
    .max(5, 'Tag cannot exceed 5 characters'),
  server: z.enum(serverOptions).default('NA'),
});

export type SummonerFormData = z.infer<typeof summonerFormSchema>;
