import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom';


export default function SignUp() {
 

  return (
    <div className='min-h-screen mt-20'>
      {/* <Toaster richColors position="top-center" expand={true} /> */}

      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
       
        <div className='flex-1'>
        
           <img src={logo} alt="astronaut image" className="" />
        </div>
       
        <div className='flex-1'>
        <h1 className='text-gray-800 font-bold text-3xl mb-1"'>Create new account</h1>
          <p className=''></p>
          <div className='flex gap-2 text-sm font-normal text-gray-600 mb-7 mt-1'>
            <span>Have an account?</span>
            <Link to='/signin' className='text-blue-500'>
              Sign In
            </Link>
          </div>
          <form className='flex flex-col gap-4' 
          // onSubmit={handleSubmit}
          >
            <div>
              <Label value='Email' htmlFor="email" className='font-semibold' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                // onChange={handleChange}
                
                required
              />
            </div>
            <div>
              <Label value='Password' className='font-semibold' />
              <TextInput
                type='password'
                placeholder='Password'
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
              Sign up
              {/* {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign Up'
              )} */}
            </Button>
            {/* <OAuth /> */}
          </form>
          
          
        </div>
      </div>
    </div>
  );
}