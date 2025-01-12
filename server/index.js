import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
import rateLimit from 'express-rate-limit';

import { regionMappings } from './regions.js';

dotenv.config();

const app = express();
app.use(cors());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
  maxKeys: 1000,
});

const CACHE_DURATIONS = {
  summoner: 3600,
  ranked: 300,
  activeGame: 120,
};

const getRiotData = async (cacheKey, ttl, apiCall) => {
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log(`Cache hit for ${cacheKey}`);
    return cachedData;
  }

  console.log(`Cache miss for ${cacheKey}`);
  const data = await apiCall();

  cache.set(cacheKey, data, ttl);
  return data;
};

app.get('/summoner/:name/:tag/:region', async (req, res) => {
  try {
    const { name, tag, region } = req.params;
    const regionConfig = regionMappings[region];

    const summonerCacheKey = `summoner-${region}-${name}-${tag}`;

    const summonerData = await getRiotData(
      summonerCacheKey,
      CACHE_DURATIONS.summoner,
      async () => {
        const riotIdResponse = await axios.get(
          `https://${regionConfig.regional}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}`,
          {
            headers: { 'X-Riot-Token': process.env.RIOT_API_KEY },
          },
        );

        const summonerResponse = await axios.get(
          `https://${regionConfig.platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${riotIdResponse.data.puuid}`,
          {
            headers: { 'X-Riot-Token': process.env.RIOT_API_KEY },
          },
        );

        return summonerResponse.data;
      },
    );

    res.json(summonerData);
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.get('/ranked/:summonerId/:region', async (req, res) => {
  try {
    const { summonerId, region } = req.params;
    const regionConfig = regionMappings[region];

    const rankedCacheKey = `ranked-${region}-${summonerId}`;

    const rankedData = await getRiotData(
      rankedCacheKey,
      CACHE_DURATIONS.ranked,
      async () => {
        const response = await axios.get(
          `https://${regionConfig.platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
          {
            headers: { 'X-Riot-Token': process.env.RIOT_API_KEY },
          },
        );
        return response.data;
      },
    );

    res.json(rankedData);
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.get('/active-game/:puuid/:region', async (req, res) => {
  try {
    const { puuid, region } = req.params;
    const regionConfig = regionMappings[region];

    const gameCacheKey = `game-${region}-${puuid}`;

    const gameData = await getRiotData(
      gameCacheKey,
      CACHE_DURATIONS.activeGame,
      async () => {
        const response = await axios.get(
          `https://${regionConfig.platform}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}`,
          {
            headers: { 'X-Riot-Token': process.env.RIOT_API_KEY },
          },
        );
        return { inGame: true, data: response.data };
      },
    );

    res.json(gameData);
  } catch (error) {
    if (error.response?.status === 404) {
      res.json({ inGame: false });
    } else {
      console.error('Error details:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
