import { Rank, Division } from '../types/summonerData';

export type RankDivision = {
  rank: Rank;
  division: Division | null;
  label: string;
};

export const generateRankOptions = (): RankDivision[] => {
  const ranks: Rank[] = [
    'IRON',
    'BRONZE',
    'SILVER',
    'GOLD',
    'PLATINUM',
    'EMERALD',
    'DIAMOND',
    'MASTER',
    'GRANDMASTER',
    'CHALLENGER',
  ];

  // Start from Gold, removing Iron, Bronze, and Silver
  const filteredRanks = ranks.slice(ranks.indexOf('GOLD'));

  const divisions: Division[] = ['IV', 'III', 'II', 'I'];

  return filteredRanks.flatMap((rank): RankDivision[] => {
    // Master, Grandmaster, and Challenger don't have divisions
    if (['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(rank)) {
      return [
        {
          rank: rank as Rank,
          division: null,
          label: rank,
        },
      ];
    }

    // Other ranks have divisions
    return divisions.map(division => ({
      rank: rank as Rank,
      division: division as Division,
      label: `${rank} ${division}`,
    }));
  });
};
