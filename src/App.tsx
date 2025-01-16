import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SummonerFormData } from './types/formSchema';
import { rankedStats, Rank, Division } from './types/summonerData';
import { fetchSummonerData, setupPolling } from './utils/api';
import Widget from './components/Widget';
import SummonerForm from './components/SummonerForm';

const App = () => {
  const [rankedStats, setRankedStats] = useState<rankedStats | null>(null);
  const [summonerInfo, setSummonerInfo] = useState<SummonerFormData | null>(
    null,
  );
  const [goalRank, setGoalRank] = useState<Rank>('PLATINUM');
  const [goalDivision, setGoalDivision] = useState<Division | null>('IV');

  console.log('summonerInfo', summonerInfo);

  const handleSubmit = async (data: SummonerFormData) => {
    setSummonerInfo(data);
    const stats = await fetchSummonerData(
      data.summonerName,
      data.tag,
      data.server,
    );

    const [rank, division] = data.goalRank.split(' ');

    if (stats) {
      setRankedStats(stats);
      setupPolling(data.summonerName, data.tag, data.server, setRankedStats);
      setGoalRank(rank as Rank);
      setGoalDivision((division as Division) || null);
    }
  };

  const getWidgetUrl = () => {
    if (!summonerInfo) return null;

    const params = new URLSearchParams({
      summonerName: summonerInfo.summonerName,
      tag: summonerInfo.tag,
      server: summonerInfo.server,
      goalRank: summonerInfo.goalRank,
    });

    return `/widget?${params.toString()}`;
  };

  return (
    <div className='min-h-screen bg-gray-900 pt-10 pb-10'>
      <div className='container mx-auto px-4'>
        <SummonerForm onSubmit={handleSubmit} />

        {summonerInfo && rankedStats && (
          <div className='space-y-6'>
            <div className='flex justify-center'>
              <Widget
                stats={rankedStats}
                goalRank={goalRank}
                goalDivision={goalDivision}
                summonerName={summonerInfo.summonerName}
              />
            </div>

            <div className='flex flex-col items-center space-y-4 pt-4'>
              <p className='text-gray-300 font-bold'>Widget URL</p>
              <div className='flex items-center gap-4'>
                <input
                  type='text'
                  value={window.location.origin + getWidgetUrl()}
                  className='bg-gray-800 text-gray-200 p-2 rounded-md w-96'
                  readOnly
                />
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      window.location.origin + getWidgetUrl(),
                    )
                  }
                  className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'
                >
                  Copy URL
                </button>
              </div>
              <Link
                to={getWidgetUrl() || '#'}
                target='_blank'
                className='text-blue-400 hover:text-blue-300'
              >
                Open widget in new tab
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
