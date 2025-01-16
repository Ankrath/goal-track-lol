import { rankedStats } from '../types/summonerData';

export type FetchError = 'summoner_not_found' | 'no_ranked_data';

export type FetchResult = {
  data: rankedStats | null;
  error?: FetchError;
};

export const fetchSummonerData = async (
  summonerName: string,
  tag: string,
  server: string,
): Promise<FetchResult> => {
  try {
    const summonerResponse = await fetch(
      `http://localhost:3001/summoner/${summonerName}/${tag}/${server}`,
    );
    const summonerData = await summonerResponse.json();

    console.log('summonerData', summonerData);

    if (!summonerData.id) {
      return { data: null, error: 'summoner_not_found' };
    }

    const rankedResponse = await fetch(
      `http://localhost:3001/ranked/${summonerData.id}/${server}`,
    );
    const rankedData = await rankedResponse.json();

    console.log('rankedData', rankedData);

    if (!rankedData || !rankedData.length) {
      return { data: null, error: 'no_ranked_data' };
    }

    // Find solo queue ranked data
    const soloQueueData = rankedData.find(
      (queue: rankedStats) => queue.queueType === 'RANKED_SOLO_5x5',
    );

    if (!soloQueueData) {
      return { data: null, error: 'no_ranked_data' };
    }

    return { data: soloQueueData };
  } catch (error) {
    console.error('Error fetching summoner data:', error);
    return { data: null, error: 'summoner_not_found' };
  }
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

        // Find solo queue ranked data
        const soloQueueData = rankedData.find(
          (queue: rankedStats) => queue.queueType === 'RANKED_SOLO_5x5',
        );

        if (soloQueueData) {
          onUpdate(soloQueueData);
        }

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
