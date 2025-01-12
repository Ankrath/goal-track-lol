import { useEffect, useState } from 'react';
import Widget from './components/Widget';

const App = () => {
  const [rankedStats, setRankedStats] = useState([]);
  const [summonerId, setSummonerId] = useState<string | null>(null);
  const [puuid, setPuuid] = useState<string | null>(null);

  const goalRank = 'PLATINUM';
  const goalDivision = 'IV';

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const summonerResponse = await fetch(
          `http://localhost:3001/summoner/Aircoots/PRIME/NA`,
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
          `http://localhost:3001/active-game/${puuid}/NA`,
        );
        const gameData = await gameResponse.json();
        console.log('Game Status:', gameData);

        const rankedResponse = await fetch(
          `http://localhost:3001/ranked/${id}/NA`,
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
  }, []);

  return (
    <div className='m-10'>
      <Widget
        stats={rankedStats}
        goalRank={goalRank}
        goalDivision={goalDivision}
      />
    </div>
  );
};

export default App;
