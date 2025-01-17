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
  summonerName: string;
};

const Widget = ({
  stats,
  goalRank,
  goalDivision,
  summonerName,
}: WidgetProps) => {
  const winRate =
    stats?.wins && stats?.losses
      ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(0)
      : '0';

  const calculateProgress = () => {
    if (!stats?.tier) return 0;

    const currentRankValue = rankOrder[stats.tier];
    const goalRankValue = rankOrder[goalRank];

    if (['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(goalRank)) {
      return (currentRankValue / goalRankValue) * 100;
    }

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
    <div className='flex flex-col items-center w-52 -space-y-6'>
      <img
        src={`/${stats.tier.toLowerCase()}.webp`}
        alt={`${stats.tier} rank`}
        className='w-52 h-52 object-contain'
      />

      <div className='tracking-wider font-bold antialiased w-full relative text-white [text-shadow:_1px_1px_0_rgb(0_0_0_/_100%),_-1px_-1px_0_rgb(0_0_0_/_100%),_1px_-1px_0_rgb(0_0_0_/_100%),_-1px_1px_0_rgb(0_0_0_/_100%)]'>
        <div className='px-2'>
          <div className='text-xl text-center'>
            {summonerName || 'Summoner'}
          </div>

          <div className='text-center mt-1 text-lg'>
            {stats.tier}
            {!['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(stats.tier) &&
              ` ${stats.rank}`}
            {` ${stats.leaguePoints}LP`}
          </div>

          <div className='text-center mt-0.5 text-lg'>
            <span className='text-green-500'>{stats?.wins || 0}W</span>{' '}
            <span className='text-red-500'>{stats?.losses || 0}L</span>{' '}
            {winRate}%
          </div>

          <div className='w-full mt-2 mb-2 tracking-wide'>
            <div className='text-center'>
              {progress >= 100
                ? `${goalRank}${
                    goalDivision ? ` ${goalDivision}` : ''
                  } Achieved!`
                : `${Math.floor(progress)}% to ${goalRank}${
                    goalDivision ? ` ${goalDivision}` : ''
                  }`}
            </div>
            <div className='w-full bg-gray-800/60 rounded-full h-1.5 mt-1'>
              <div
                className={`${
                  progress >= 100
                    ? 'bg-green-500'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600'
                } h-1.5 rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Widget;
