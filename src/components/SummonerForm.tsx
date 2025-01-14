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
    defaultValues: {
      server: 'NA',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mb-6'>
      <div>
        <input
          {...register('summonerName')}
          placeholder='Summoner Name'
          className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        {errors.summonerName && (
          <p className='text-red-500 text-sm mt-1'>
            {errors.summonerName.message}
          </p>
        )}
      </div>

      <div>
        <input
          {...register('tag')}
          placeholder='Tag'
          className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        {errors.tag && (
          <p className='text-red-500 text-sm mt-1'>{errors.tag.message}</p>
        )}
      </div>

      <div>
        <select
          {...register('server')}
          className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
        >
          {serverOptions.map(server => (
            <option key={server} value={server}>
              {server}
            </option>
          ))}
        </select>
        {errors.server && (
          <p className='text-red-500 text-sm mt-1'>{errors.server.message}</p>
        )}
      </div>

      <button
        type='submit'
        className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors'
      >
        Track Summoner
      </button>
    </form>
  );
};

export default SummonerForm;
