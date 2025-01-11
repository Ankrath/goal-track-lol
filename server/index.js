import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

import { regionMappings } from './regions.js';

dotenv.config();

const app = express();
app.use(cors());

app.get('/summoner/:name/:tag/:region', async (req, res) => {
  try {
    const region = regionMappings[req.params.region];

    const riotIdResponse = await axios.get(
      `https://${region.regional}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${req.params.name}/${req.params.tag}`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY,
        },
      },
    );

    const summonerResponse = await axios.get(
      `https://${region.platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${riotIdResponse.data.puuid}`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY,
        },
      },
    );

    console.log('Full Summoner Data:', summonerResponse.data);
    res.json(summonerResponse.data);
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.get('/ranked/:summonerId/:region', async (req, res) => {
  try {
    const region = regionMappings[req.params.region];

    const rankedResponse = await axios.get(
      `https://${region.platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${req.params.summonerId}`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY,
        },
      },
    );
    console.log('Ranked Data:', rankedResponse.data);
    res.json(rankedResponse.data);
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.get('/active-game/:puuid/:region', async (req, res) => {
  try {
    const region = regionMappings[req.params.region];
    const response = await axios.get(
      `https://${region.platform}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${req.params.puuid}`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY,
        },
      },
    );
    res.json({ inGame: true, data: response.data });
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
