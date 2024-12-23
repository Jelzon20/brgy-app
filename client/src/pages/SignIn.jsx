import { useState } from 'react';
import {Button, Label, Spinner, TextInput } from 'flowbite-react';
import logo from "../assets/signin.png";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../../redux/user/userSlice';
import { Toaster, toast } from 'sonner'

export default function SignIn() {  
  const expireTime = Date.now() + 3600000;
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage, currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const handleChange = (e) => { 
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      
      dispatch(signInFailure('Please fill all the fields'));
      toast.error('Please fill all the fields')
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        
        toast.error(data.message)
      }

      if (res.ok) {
        localStorage.setItem('expiresIn', expireTime);
        dispatch(signInSuccess(data));
        toast.success("Sign in successful")
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error(error.message)
    }
  };


  return (
    <div className='min-h-screen mt-20'>
      <Toaster richColors position="top-center" expand={true} />
   
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
          onSubmit={handleSubmit}
          >
            <div>
              <Label value='Your email' htmlFor='email' className='font-semibold'/>
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
                // required
              />
            </div>
            <div>
              <Label value='Your password' htmlFor='password' className='font-semibold'/>
              <TextInput
                type='password'
                placeholder='**********'
                id='password'
                onChange={handleChange}
                // required
              />
            </div>
            <Button
              className='bg-indigo-950'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign In'
              )} 
            </Button>
          </form>
         
        </div>
      </div>
    </div>
  );
}