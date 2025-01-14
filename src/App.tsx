import { useEffect, useState } from 'react';
import Widget from './components/Widget';
import SummonerForm from './components/SummonerForm';
import { SummonerFormData } from './types/formSchema';

const App = () => {
  const [rankedStats, setRankedStats] = useState([]);
  const [summonerId, setSummonerId] = useState<string | null>(null);
  const [puuid, setPuuid] = useState<string | null>(null);
  const [summonerInfo, setSummonerInfo] = useState<SummonerFormData | null>(
    null,
  );

  const goalRank = 'PLATINUM';
  const goalDivision = 'IV';

  const handleSubmit = (data: SummonerFormData) => {
    setSummonerInfo(data);
  };

  useEffect(() => {
    if (!summonerInfo) return;

    const fetchInitialData = async () => {
      try {
        const summonerResponse = await fetch(
          `http://localhost:3001/summoner/${summonerInfo.summonerName}/${summonerInfo.tag}/${summonerInfo.server}`,
        );
        const summonerData = await summonerResponse.json();
        console.log('Initial Summoner Data:', summonerData);

        if (summonerData.id && summonerData.puuid) {
          setSummonerId(summonerData.id);
          setPuuid(summonerData.puuid);
          return { id: summonerData.id, puuid: summonerData.puuid };
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
      return null;
    };

    const fetchUpdates = async (id: string, puuid: string) => {
      try {
        console.log('Fetching updates at:', new Date().toLocaleTimeString());

        const gameResponse = await fetch(
          `http://localhost:3001/active-game/${puuid}/${summonerInfo.server}`,
        );
        const gameData = await gameResponse.json();
        console.log('Game Status:', gameData);

        const rankedResponse = await fetch(
          `http://localhost:3001/ranked/${id}/${summonerInfo.server}`,
        );
        const rankedData = await rankedResponse.json();
        console.log('Ranked Data:', rankedData);
        setRankedStats(rankedData[0]);

        if (gameData.inGame) {
          console.log('Next update in: 5 minutes (in game)');
          return 5 * 60 * 1000;
        }

        console.log('Next update in: 15 minutes (not in game)');
        return 15 * 60 * 1000;
      } catch (error) {
        console.error('Error fetching updates:', error);
        return 10 * 60 * 1000;
      }
    };

    const setupPolling = async () => {
      const initialData = await fetchInitialData();
      if (!initialData) return;

      const poll = async () => {
        const interval = await fetchUpdates(initialData.id, initialData.puuid);
        return setInterval(poll, interval);
      };

      const intervalId = await poll();
      return () => clearInterval(intervalId);
    };

    setupPolling();
  }, [summonerInfo]);

  return (
    <div className='m-10'>
      <SummonerForm onSubmit={handleSubmit} />
      {rankedStats && (
        <Widget
          stats={rankedStats}
          goalRank={goalRank}
          goalDivision={goalDivision}
        />
      )}
    </div>
  );
};

export default App;
