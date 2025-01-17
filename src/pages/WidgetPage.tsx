import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { rankedStats, Rank, Division } from '../types/summonerData';
import { fetchSummonerData, setupPolling } from '../utils/api';
import Widget from '../components/Widget';

const WidgetPage = () => {
  const [searchParams] = useSearchParams();
  const [rankedStats, setRankedStats] = useState<rankedStats | null>(null);

  const summonerName = searchParams.get('summonerName');
  const tag = searchParams.get('tag');
  const server = searchParams.get('server');

  const goalRankFull = searchParams.get('goalRank') || 'PLATINUM IV';
  const [rank, division] = goalRankFull.split(' ');
  const goalRank = rank as Rank;
  const goalDivision = (division || null) as Division | null;

  useEffect(() => {
    const fetchData = async () => {
      if (!summonerName || !tag || !server) return;

      const result = await fetchSummonerData(summonerName, tag, server);
      if (result.data) {
        setRankedStats(result.data);
        setupPolling(summonerName, tag, server, setRankedStats);
      }
    };

    fetchData();
  }, [summonerName, tag, server]);

  if (!rankedStats || !summonerName || !tag || !server) {
    return null;
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center pointer-events-none'>
      <div className='pointer-events-auto'>
        <Widget
          stats={rankedStats}
          goalRank={goalRank}
          goalDivision={goalDivision}
          summonerName={summonerName}
        />
      </div>
    </div>
  );
};

export default WidgetPage;
