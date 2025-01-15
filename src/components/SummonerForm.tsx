import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SummonerFormData,
  summonerFormSchema,
  serverOptions,
} from '../types/formSchema';

type SummonerFormProps = {
  onSubmit: (data: SummonerFormData) => void;
};

const SummonerForm = ({ onSubmit }: SummonerFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SummonerFormData>({
    resolver: zodResolver(summonerFormSchema),
  });

  return (
    <div className='flex justify-center'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
          Track Summoner
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-1'>
            <label className='block text-sm font-medium text-gray-700'>
              Summoner Name
            </label>
            <input
              {...register('summonerName')}
              placeholder='Enter summoner name'
              className='w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
            {errors.summonerName && (
              <p className='text-red-500 text-sm'>
                {errors.summonerName.message}
              </p>
            )}
          </div>

          <div className='space-y-1'>
            <label className='block text-sm font-medium text-gray-700'>
              Tag
            </label>
            <input
              {...register('tag')}
              placeholder='Enter tag'
              className='w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
            {errors.tag && (
              <p className='text-red-500 text-sm'>{errors.tag.message}</p>
            )}
          </div>

          <div className='space-y-1'>
            <label className='block text-sm font-medium text-gray-700'>
              Server
            </label>
            <select
              {...register('server')}
              className='w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            >
              {serverOptions.map(server => (
                <option key={server} value={server}>
                  {server}
                </option>
              ))}
            </select>
            {errors.server && (
              <p className='text-red-500 text-sm'>{errors.server.message}</p>
            )}
          </div>

          <button
            type='submit'
            className='w-full mt-6 bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200'
          >
            Track Summoner
          </button>
        </form>
      </div>
    </div>
  );
};

export default SummonerForm;
