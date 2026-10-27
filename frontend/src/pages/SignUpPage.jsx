import {useState} from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserStore } from '../stores/useUserStore.js';

const SignUpPage = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

   const { signup, loading } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    
    <div className='flex flex-col justify-center py-1 sm:px-6 lg:px-8'>
      <motion.div
      className='sm:mx-auto sm:w-full max-w-md'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      >
        <h2 className='mt-6 text-center text-3xl font-extrabold text-red-200 h-15'>Create your account</h2>

        
      </motion.div>

      <motion.div
      
      className='sm:mx-auto sm:w-full max-w-md'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      >
        <div className="w-full px-4 py-8 sm:px-10">


          

          <form onSubmit={handleSubmit} className='space-y-6'>
           <div>
            {/* <label htmlFor="name" className='block text-sm font-medium text-gray-300'>
              Full name
            </label> */}
            <div className='mt-1 relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <User className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </div>
              <input
                id='name'
                type='text'
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className='block w-full pl-10 px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'
                placeholder='Full name'
              />
            </div>
            </div>

           <div>
            {/* <label htmlFor="name" className='block text-sm font-medium text-gray-300'>
              Full name
            </label> */}
            <div className='mt-1 relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 flex 
              items-center pointer-events-none'>
                <Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </div>
              <input
                id='email'
                type='email'
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className='block w-full pl-10 px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'
                placeholder='Email'
              />
            </div>
            </div> 

           <div>
            {/* <label htmlFor="name" className='block text-sm font-medium text-gray-300'>
              Full name
            </label> */}
            <div className='mt-1 relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </div>
              <input
                id='password'
                type='password'
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className='block w-full pl-10 px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'
                placeholder='Password'
              />
            </div>
            </div> 

           <div>
            {/* <label htmlFor="name" className='block text-sm font-medium text-gray-300'>
              Full name
            </label> */}
            <div className='mt-1 relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 flex 
              items-center pointer-events-none'>
                <Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </div>
              <input
                id='confirmPassword'
                type='password'
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className='block w-full pl-10 px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'
                placeholder='Confirm Password'
              />
            </div>
            </div>

           <button 
           type='submit' className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out disabled:opacity-50' disabled={loading}
           >
            {loading ? (
              <>
                <Loader className='mr-2 h-5 w-5 animate-spin'aria-hidden='true' />
                Loading...
              </>
              ) : (
              <>
                <UserPlus className='mr-2 h-5 w-5' aria-hidden='true' />
                Sign Up
              </>
            )}
            </button>   



          </form>

          <p className='mt-8 text-center text-sm text-gray-300'>
            Already have an account? {' '}
            <Link to='/login' className='font-medium text-red-700 hover:text-red-900'>
             Login here <ArrowRight className='inline-block h-4 w-4'/>
             </Link>
          </p>

        </div>
      </motion.div>

    </div>

  )
}

export default SignUpPage