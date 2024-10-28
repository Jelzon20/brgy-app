import {Button, Label, Spinner, TextInput } from 'flowbite-react';
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom';


export default function SignIn() {  
 

  return (
    <div className='min-h-screen mt-20'>
      {/* <Toaster richColors position="top-center" expand={true} /> */}
   
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
        <img src={logo} alt="main logo" className="" />
        
        </div>
        
        {/* right */}
        <div className='flex-1'>
          <h1 className='text-gray-800 font-bold text-3xl mb-5"'>Welcome back!</h1>
          <p className='mb-7 mt-1'>Sign In now!</p>
          <form className='flex flex-col gap-4' 
          // onSubmit={handleSubmit}
          >
            <div>
              <Label value='Your email' htmlFor='email' className='font-semibold'/>
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                // onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label value='Your password' htmlFor='password' className='font-semibold'/>
              <TextInput
                type='password'
                placeholder='**********'
                id='password'
                // onChange={handleChange}
                required
              />
            </div>
            <Button
              className='bg-indigo-950'
              type='submit'
              // disabled={loading}
            >
              {/* {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign In'
              )} */}
              Sign In
            </Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Don't Have an account?</span>
            <Link to='/signup' className='text-indigo-950'>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}