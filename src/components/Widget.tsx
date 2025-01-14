const rankOrder = {
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

const divisionOrder = {
  IV: 0,
  III: 1,
  II: 2,
  I: 3,
};

const Widget = ({ stats, goalRank, goalDivision }) => {
  // console.log('stats', stats);

  const winRate =
    stats?.wins && stats?.losses
      ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1)
      : '0';

  const calculateProgress = () => {
    if (!stats?.tier) return 0;

    const currentRankValue = rankOrder[stats.tier];
    const goalRankValue = rankOrder[goalRank];

    const currentDivisionValue = divisionOrder[stats.rank];
    const goalDivisionValue = divisionOrder[goalDivision];

    const totalSteps = goalRankValue * 4 + goalDivisionValue;
    const currentSteps = currentRankValue * 4 + currentDivisionValue;

    const lpProgress = stats.leaguePoints / 100;
    const currentProgress = currentSteps + lpProgress;

    return (currentProgress / totalSteps) * 100;
  };

  const progress = calculateProgress();

  return (
    <div className='w-96 text-white rounded-lg shadow-lg bg-black/40'>
      <div className='p-3'>
        <div className='flex gap-3 mb-2'>
          <div className='w-12 h-12 bg-black/40 rounded flex items-center justify-center'>
            <span className='text-gray-400'>Rank</span>
          </div>

          <div>
            <div className='text-lg font-bold leading-tight'>
              {stats?.tier} {stats?.rank} {stats?.leaguePoints}LP
            </div>

            <div className='text-sm text-gray-200'>
              W: {stats?.wins || 0} L: {stats?.losses || 0} WR: {winRate}%
            </div>
          </div>
        </div>

        <div className='text-xs text-gray-300 mb-1'>
          Road to {goalRank} {goalDivision} ({progress.toFixed(1)}%)
        </div>
        <div className='w-full bg-black/40 rounded-full h-1'>
          <div
            className='bg-blue-400 h-1 rounded-full transition-all duration-500'
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Widget;
