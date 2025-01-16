import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi2';
import { SummonerFormData } from '../types/formSchema';
import { rankedStats, Rank, Division } from '../types/summonerData';
import { fetchSummonerData, setupPolling, FetchError } from '../utils/api';
import Widget from '../components/Widget';
import SummonerForm from '../components/SummonerForm';

const Track = () => {
  const [rankedStats, setRankedStats] = useState<rankedStats | null>(null);
  const [summonerInfo, setSummonerInfo] = useState<SummonerFormData | null>(
    null,
  );
  const [goalRank, setGoalRank] = useState<Rank>('CHALLENGER');
  const [goalDivision, setGoalDivision] = useState<Division | null>('IV');
  const [error, setError] = useState<FetchError | null>(null);

  const handleSubmit = async (data: SummonerFormData) => {
    setError(null);
    setSummonerInfo(data);

    const result = await fetchSummonerData(
      data.summonerName,
      data.tag,
      data.server,
    );

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.data) {
      const [rank, division] = data.goalRank.split(' ');
      setRankedStats(result.data);
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
        <SummonerForm onSubmit={handleSubmit} currentRank={rankedStats?.tier} />

        {error === 'summoner_not_found' && (
          <p className='text-red-500 mt-4 text-center'>
            Summoner not found. Please check the name and try again.
          </p>
        )}

        {error === 'no_ranked_data' && (
          <p className='text-red-500 mt-4 text-center'>
            This summoner hasn't played enough ranked games this season.
          </p>
        )}

        {!error && summonerInfo && rankedStats && (
          <div className='space-y-6'>
            <div className='flex justify-center'>
              <Widget
                stats={rankedStats}
                goalRank={goalRank}
                goalDivision={goalDivision}
                summonerName={summonerInfo.summonerName}
              />
            </div>

            <div className='max-w-2xl mx-auto pt-8'>
              <div className='p-6 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl shadow-lg'>
                <p className='text-xl font-semibold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4'>
                  Your Widget
                </p>

                <div className='flex flex-col gap-4'>
                  <div className='flex items-center gap-3'>
                    <input
                      type='text'
                      value={window.location.origin + getWidgetUrl()}
                      className='flex-1 p-3 bg-gray-900/50 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                      readOnly
                    />
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          window.location.origin + getWidgetUrl(),
                        )
                      }
                      className='px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center gap-2'
                    >
                      Copy URL
                    </button>
                  </div>

                  <div className='text-center'>
                    <Link
                      to={getWidgetUrl() || '#'}
                      target='_blank'
                      className='inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200'
                    >
                      Open widget in new tab
                      <HiArrowRight className='w-4 h-4' />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Track;
