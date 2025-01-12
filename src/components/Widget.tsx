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
  console.log('stats', stats);

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
    <div
      className='w-96 text-white rounded-lg shadow-lg'
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
      }}
    >
      <div className='p-4'>
        <div className='flex gap-4'>
          <div className='w-16 h-16 bg-black rounded-lg flex items-center justify-center'>
            <span className='text-gray-400'>Rank</span>
          </div>

          <div className='flex-1'>
            <div className='flex justify-between items-center mb-1'>
              <div className='text-xl font-bold'>
                {stats?.tier} {stats?.rank}
              </div>
              <div className='text-blue-400 font-semibold'>
                {stats?.leaguePoints} LP
              </div>
            </div>

            <div className='flex gap-4 text-sm mb-4 text-gray-300'>
              <span>W: {stats?.wins || 0}</span>
              <span>L: {stats?.losses || 0}</span>
              <span>WR: {winRate}%</span>
            </div>

            <div className='flex justify-between text-sm text-gray-400 mb-1'>
              <span>
                Road to {goalRank} {goalDivision}
              </span>
              <span>{progress.toFixed(1)}%</span>
            </div>

            <div className='w-full bg-slate-700 rounded-full h-1.5'>
              <div
                className='bg-blue-400 h-1.5 rounded-full transition-all duration-500'
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Widget;
