import { rankedStats } from '../types/summonerData';

export const fetchSummonerData = async (
  summonerName: string,
  tag: string,
  server: string,
): Promise<rankedStats | null> => {
  try {
    const summonerResponse = await fetch(
      `http://localhost:3001/summoner/${summonerName}/${tag}/${server}`,
    );
    const summonerData = await summonerResponse.json();

    if (summonerData.id) {
      const rankedResponse = await fetch(
        `http://localhost:3001/ranked/${summonerData.id}/${server}`,
      );
      const rankedData = await rankedResponse.json();
      return rankedData[0];
    }
  } catch (error) {
    console.error('Error fetching summoner data:', error);
  }
  return null;
};

export const setupPolling = async (
  summonerName: string,
  tag: string,
  server: string,
  onUpdate: (data: rankedStats) => void,
) => {
  try {
    const summonerResponse = await fetch(
      `http://localhost:3001/summoner/${summonerName}/${tag}/${server}`,
    );
    const summonerData = await summonerResponse.json();

    if (!summonerData.id || !summonerData.puuid) return null;

    const fetchUpdates = async () => {
      try {
        const gameResponse = await fetch(
          `http://localhost:3001/active-game/${summonerData.puuid}/${server}`,
        );
        const gameData = await gameResponse.json();

        const rankedResponse = await fetch(
          `http://localhost:3001/ranked/${summonerData.id}/${server}`,
        );
        const rankedData = await rankedResponse.json();
        onUpdate(rankedData[0]);

        return gameData.inGame ? 5 * 60 * 1000 : 15 * 60 * 1000;
      } catch (error) {
        console.error('Error fetching updates:', error);
        return 10 * 60 * 1000;
      }
    };

    const poll = async () => {
      const interval = await fetchUpdates();
      return setTimeout(poll, interval);
    };

    return poll();
  } catch (error) {
    console.error('Error setting up polling:', error);
    return null;
  }
};
