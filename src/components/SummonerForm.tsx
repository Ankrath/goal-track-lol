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
    <div className=' bg-[#111827] pb-8'>
      <div className='container mx-auto px-4'>
        <div className='max-w-2xl mx-auto'>
          <div className='p-8 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl shadow-xl'>
            <h2 className='text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400'>
              Goal Tracker
            </h2>

            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className='space-y-6'
            >
              <div className='space-y-2'>
                <label className='block text-base font-medium text-gray-200'>
                  Game Name
                </label>
                <input
                  {...register('summonerName')}
                  placeholder='Enter game name'
                  className='w-full p-3 bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                />
                {errors.summonerName && (
                  <p className='text-red-400 text-sm mt-1'>
                    {errors.summonerName.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='block text-base font-medium text-gray-200'>
                  Tag
                </label>
                <input
                  {...register('tag')}
                  placeholder='Enter tag'
                  className='w-full p-3 bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                />
                {errors.tag && (
                  <p className='text-red-400 text-sm mt-1'>
                    {errors.tag.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='block text-base font-medium text-gray-200'>
                  Server
                </label>
                <select
                  {...register('server')}
                  className='w-full p-3 bg-gray-900/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                >
                  {serverOptions.map(server => (
                    <option key={server} value={server} className='bg-gray-900'>
                      {server}
                    </option>
                  ))}
                </select>
                {errors.server && (
                  <p className='text-red-400 text-sm mt-1'>
                    {errors.server.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='block text-base font-medium text-gray-200'>
                  Goal
                </label>
                <select
                  {...register('goalRank')}
                  className='w-full p-3 bg-gray-900/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                >
                  {rankOptions.map(({ label }) => (
                    <option key={label} value={label} className='bg-gray-900'>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.goalRank && (
                  <p className='text-red-400 text-sm mt-1'>
                    {errors.goalRank.message}
                  </p>
                )}
              </div>

              <button
                type='submit'
                disabled={isTracked}
                className={`w-full p-3 mt-6 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 ${
                  isTracked
                    ? 'bg-emerald-600 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                }`}
              >
                {isTracked ? 'Tracked!' : 'Track Player'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummonerForm;
