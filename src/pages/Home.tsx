import { Link } from 'react-router-dom';
import { HiArrowRight, HiChartBar } from 'react-icons/hi2';
import { IoShieldCheckmark } from 'react-icons/io5';
import { IoRocket } from 'react-icons/io5';

const Home = () => {
  return (
    <div className='min-h-screen bg-[#111827] text-gray-100'>
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none' />
        <div className='container mx-auto px-4 pt-20 pb-16 relative z-10'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='relative'>
              <h1 className='text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 leading-tight tracking-tight pb-4'>
                Track Your League Journey
              </h1>
              <div className='absolute inset-0 opacity-0 pointer-events-none text-4xl md:text-6xl font-extrabold leading-tight tracking-tight'>
                Track Your League Journey
              </div>
            </div>
            <p className='text-xl md:text-2xl text-gray-300 mb-8 py-6'>
              Set your ranked goals, track your progress, and share your climb
              with your community
            </p>
            <Link
              to='/track'
              className='inline-flex items-center px-6 py-3 text-lg font-medium rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors gap-2'
            >
              Start Tracking
              <HiArrowRight className='w-5 h-5' />
            </Link>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-20 py-20'>
        <div className='grid md:grid-cols-3 gap-8'>
          <div className='p-6 rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700'>
            <div className='w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center mb-4'>
              <IoShieldCheckmark className='w-6 h-6 text-blue-400' />
            </div>
            <h3 className='text-xl font-semibold mb-3'>Real-time Tracking</h3>
            <p className='text-gray-400'>
              Monitor your ranked progress with automatic updates as you climb
              the ladder
            </p>
          </div>

          <div className='p-6 rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700'>
            <div className='w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center mb-4'>
              <IoRocket className='w-6 h-6 text-purple-400' />
            </div>
            <h3 className='text-xl font-semibold mb-3'>Set Your Goals</h3>
            <p className='text-gray-400'>
              Define your target rank and track your journey from Iron to
              Challenger
            </p>
          </div>

          <div className='p-6 rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700'>
            <div className='w-12 h-12 rounded-lg bg-emerald-600/20 flex items-center justify-center mb-4'>
              <HiChartBar className='w-6 h-6 text-emerald-400' />
            </div>
            <h3 className='text-xl font-semibold mb-3'>Share Progress</h3>
            <p className='text-gray-400'>
              Get a custom widget to share your ranked progress with your live
              viewers
            </p>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-20'>
        <h2 className='text-3xl md:text-4xl font-bold text-center mb-12'>
          How It Works
        </h2>
        <div className='max-w-6xl mx-auto'>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='flex flex-col items-center text-center'>
              <div className='w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mb-4'>
                <span className='font-semibold text-lg'>1</span>
              </div>
              <div>
                <h3 className='text-xl font-semibold mb-2'>
                  Enter Your Details
                </h3>
                <p className='text-gray-400'>
                  Provide your game name, tag, and server to get started
                </p>
              </div>
            </div>

            <div className='flex flex-col items-center text-center'>
              <div className='w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mb-4'>
                <span className='font-semibold text-lg'>2</span>
              </div>
              <div>
                <h3 className='text-xl font-semibold mb-2'>Set Your Goal</h3>
                <p className='text-gray-400'>
                  Choose your target rank from Iron to Challenger
                </p>
              </div>
            </div>

            <div className='flex flex-col items-center text-center'>
              <div className='w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mb-4'>
                <span className='font-semibold text-lg'>3</span>
              </div>
              <div>
                <h3 className='text-xl font-semibold mb-2'>
                  Share Your Progress
                </h3>
                <p className='text-gray-400'>
                  Get a custom widget URL to showcase your ranked journey on
                  stream
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-20'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-6'>
            Ready to Start Your Climb?
          </h2>
          <p className='text-xl text-gray-300 mb-8 py-2'>
            Join other summoners tracking their ranked progress
          </p>
          <Link
            to='/track'
            className='inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all gap-2'
          >
            Start Tracking Now
            <HiArrowRight className='w-5 h-5' />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
