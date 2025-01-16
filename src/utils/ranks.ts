import { Rank, Division } from '../types/summonerData';

export type RankDivision = {
  rank: Rank;
  division: Division | null;
  label: string;
};

export const generateRankOptions = (minimumRank?: Rank): RankDivision[] => {
  const ranks: Rank[] = [
    'GOLD',
    'PLATINUM',
    'EMERALD',
    'DIAMOND',
    'MASTER',
    'GRANDMASTER',
    'CHALLENGER',
  ];

  // Filter out ranks below it as well as the current rank
  const filteredRanks = minimumRank
    ? ranks.slice(ranks.indexOf(minimumRank) + 1)
    : ranks;

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
