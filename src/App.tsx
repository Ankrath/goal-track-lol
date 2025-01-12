import { useEffect, useState } from 'react';
import Widget from './components/Widget';

const App = () => {
  const [rankedStats, setRankedStats] = useState([]);

  const goalRank = 'GOLD';
  const goalDivision = 'IV';

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        console.log('Fetching data at:', new Date().toLocaleTimeString());

        const summonerResponse = await fetch(
          `http://localhost:3001/summoner/Shessair/EUW/EUW`,
        );
        const summonerData = await summonerResponse.json();
        console.log('Summoner Data:', summonerData);

        if (summonerData.id) {
          const rankedResponse = await fetch(
            `http://localhost:3001/ranked/${summonerData.id}/EUW`,
          );
          const rankedData = await rankedResponse.json();
          console.log('Ranked Data:', rankedData);
          setRankedStats(rankedData[0]);

          const gameResponse = await fetch(
            `http://localhost:3001/active-game/${summonerData.puuid}/EUW`,
          );
          const gameData = await gameResponse.json();
          console.log('Game Status:', gameData);
          console.log(
            'Next update in:',
            gameData.inGame ? '7 minutes' : '20 minutes',
          );

          return gameData.inGame ? 7 * 60 * 1000 : 20 * 60 * 1000;
        }
      } catch (error) {
        console.error('Error:', error);
      }
      return 10 * 60 * 1000;
    };

    const setupInterval = async () => {
      const interval = await fetchPlayerData();
      return setInterval(fetchPlayerData, interval);
    };

    let intervalId: ReturnType<typeof setInterval>;
    setupInterval().then(id => (intervalId = id));

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
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
