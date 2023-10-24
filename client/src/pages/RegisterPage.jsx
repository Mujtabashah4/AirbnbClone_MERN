import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function registerUser(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/register", { name, email, password });
      if (response.data.success) {
        toast.success("Registration Successful, Now you can login");
      } else {
        toast.error("Login Failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  }

  return (
    <div className='mt-4 grow flex items-center justify-around'>
      <Toaster position='top-center' reverseOrder={false} />
      <div className='mb-24'>
        <h1 className='text-4xl text-center mb-4'>Register</h1>
        <form className='max-w-md mx-auto ' onSubmit={registerUser}>
          <input
            type='text'
            placeholder='Username'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type='email'
            placeholder='Enter Your Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type='password'
            placeholder='Enter Your Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className='primary'>Register</button>
          <div className='text-center py-2 text-gray-500'>
            Already a member?
            <Link className='underline text-black' to={"/login"}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
