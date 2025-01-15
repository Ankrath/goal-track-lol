import { Rank, Division, rankedStats } from '../types/summonerData';

const rankOrder: Record<Rank, number> = {
  IRON: 0,
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
  PLATINUM: 4,
  EMERALD: 5,
  DIAMOND: 6,
  MASTER: 7,
  GRANDMASTER: 8,
  CHALLENGER: 9,
};

const divisionOrder: Record<Division, number> = {
  IV: 0,
  III: 1,
  II: 2,
  I: 3,
};

type WidgetProps = {
  stats: rankedStats;
  goalRank: Rank;
  goalDivision: Division | null;
};

const Widget = ({ stats, goalRank, goalDivision }: WidgetProps) => {
  const winRate =
    stats?.wins && stats?.losses
      ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1)
      : '0';

  const calculateProgress = () => {
    if (!stats?.tier) return 0;

    const currentRankValue = rankOrder[stats.tier];
    const goalRankValue = rankOrder[goalRank];

    // If the goal rank is Master or above, we only compare ranks
    if (['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(goalRank)) {
      return (currentRankValue / goalRankValue) * 100;
    }

    // For other ranks, we include divisions in the calculation
    const currentDivisionValue = divisionOrder[stats.rank];
    const goalDivisionValue = goalDivision ? divisionOrder[goalDivision] : 0;

    const totalSteps = goalRankValue * 4 + goalDivisionValue;
    const currentSteps = currentRankValue * 4 + currentDivisionValue;

    const lpProgress = stats.leaguePoints / 100;
    const currentProgress = currentSteps + lpProgress;

    return (currentProgress / totalSteps) * 100;
  };

  const progress = calculateProgress();

  return (
    <div className='w-96 text-white rounded-lg shadow-lg bg-gray-800/70'>
      <div className='p-4'>
        <div className='flex gap-4 mb-4'>
          <div className='w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center'>
            <span className='text-gray-300'>Rank</span>
          </div>

          <div>
            <div className='text-lg font-bold leading-tight text-gray-100'>
              {stats?.tier} {stats?.rank} {stats?.leaguePoints}LP
            </div>

            <div className='text-sm text-gray-300'>
              W: {stats?.wins || 0} L: {stats?.losses || 0} WR: {winRate}%
            </div>
          </div>
        </div>

        <div className='text-sm text-gray-400 mb-2'>
          Road to {goalRank} {goalDivision} ({progress.toFixed(1)}%)
        </div>
        <div className='w-full bg-gray-700 rounded-full h-1.5'>
          <div
            className='bg-blue-500 h-1.5 rounded-full transition-all duration-500'
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Widget;
