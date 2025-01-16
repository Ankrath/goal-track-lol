import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  SummonerFormData,
  summonerFormSchema,
  serverOptions,
} from '../types/formSchema';
import { generateRankOptions } from '../utils/ranks';
import { Rank } from '../types/summonerData';

type SummonerFormProps = {
  onSubmit: (data: SummonerFormData) => void;
  currentRank?: Rank;
};

const SummonerForm = ({ onSubmit, currentRank }: SummonerFormProps) => {
  const [isTracked, setIsTracked] = useState(false);
  const rankOptions = generateRankOptions(currentRank);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SummonerFormData>({
    resolver: zodResolver(summonerFormSchema),
    defaultValues: {
      server: 'NA',
      goalRank: 'CHALLENGER',
    },
  });

  const handleFormSubmit = async (data: SummonerFormData) => {
    setIsTracked(true);
    onSubmit(data);

    // Reset after 3 seconds
    setTimeout(() => {
      setIsTracked(false);
    }, 3000);
  };

  return (
    <div className='flex justify-center'>
      <div className='w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg'>
        <h2 className='text-2xl font-bold text-gray-100 mb-6 text-center'>
          Track Summoner
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
          <div className='space-y-1'>
            <label className='block text-base font-medium text-gray-300'>
              Summoner Name
            </label>
            <input
              {...register('summonerName')}
              placeholder='Enter summoner name'
              className='w-full p-2.5 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
            {errors.summonerName && (
              <p className='text-red-400 text-sm'>
                {errors.summonerName.message}
              </p>
            )}
          </div>

          <div className='space-y-1'>
            <label className='block text-base font-medium text-gray-300'>
              Tag
            </label>
            <input
              {...register('tag')}
              placeholder='Enter tag'
              className='w-full p-2.5 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
            {errors.tag && (
              <p className='text-red-400 text-sm'>{errors.tag.message}</p>
            )}
          </div>

          <div className='space-y-1'>
            <label className='block text-base font-medium text-gray-300'>
              Server
            </label>
            <select
              {...register('server')}
              className='w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            >
              {serverOptions.map(server => (
                <option key={server} value={server} className='bg-gray-700'>
                  {server}
                </option>
              ))}
            </select>
            {errors.server && (
              <p className='text-red-400 text-sm'>{errors.server.message}</p>
            )}
          </div>

          <div className='space-y-1 pb-4'>
            <label className='block text-base font-medium text-gray-300'>
              Goal
            </label>
            <select
              {...register('goalRank')}
              className='w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            >
              {rankOptions.map(({ label }) => (
                <option key={label} value={label} className='bg-gray-700'>
                  {label}
                </option>
              ))}
            </select>
            {errors.goalRank && (
              <p className='text-red-400 text-sm'>{errors.goalRank.message}</p>
            )}
          </div>

          <button
            type='submit'
            disabled={isTracked}
            className={`w-full py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 ${
              isTracked
                ? 'bg-emerald-600 text-white cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isTracked ? 'Tracked!' : 'Track Summoner'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SummonerForm;
