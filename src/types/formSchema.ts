import { z } from 'zod';
import { generateRankOptions } from '../utils/ranks';

export const serverOptions = [
  { name: 'North America', value: 'NA' },
  { name: 'Europe West', value: 'EUW' },
  { name: 'Europe Nordic & East', value: 'EUN' },
  { name: 'Korea', value: 'KR' },
  { name: 'Brazil', value: 'BR' },
  { name: 'Japan', value: 'JP' },
  { name: 'Latin America North', value: 'LAN' },
  { name: 'Latin America South', value: 'LAS' },
  { name: 'Oceania', value: 'OCE' },
  { name: 'Turkey', value: 'TR' },
  { name: 'Russia', value: 'RU' },
  { name: 'Philippines', value: 'PH' },
  { name: 'Singapore', value: 'SG' },
  { name: 'Taiwan', value: 'TW' },
  { name: 'Thailand', value: 'TH' },
  { name: 'Vietnam', value: 'VN' },
] as const;

// Create an array of just the server values for the zod enum
const serverValues = serverOptions.map(server => server.value) as [
  string,
  ...string[],
];

const rankOptions = generateRankOptions();

export const summonerFormSchema = z.object({
  summonerName: z.string().min(3).max(16),
  tag: z.string().min(3).max(5),
  server: z.enum(serverValues),
  goalRank: z
    .string()
    .refine(val => rankOptions.some(opt => opt.label === val), {
      message: 'Please select a valid rank',
    }),
});

export type SummonerFormData = z.infer<typeof summonerFormSchema>;
