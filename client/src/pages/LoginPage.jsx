import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
// import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  async function handleLoginSubmit(e) {
    e.preventDefault();
    // try {
    // const response =
    try {
      const { data } = await axios.post("/login", { email, password });
      setUser(data);
      alert("Login Successful");
      setRedirect(true);
    } catch (error) {
      alert("login failed");
    }
    //     if (response.data && response.data.success) {
    //       toast.success("Login Successful");
    //       setRedirect(true);
    //     } else {
    //       toast.error("Credentials Missing");
    //     }
    //   } catch (error) {
    //     toast.error("Credentials Incorrect");
    //   }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className='mt-4 grow flex items-center justify-around'>
      {/* <Toaster position='top-center' reverseOrder={false} /> */}
      <div className='mb-24'>
        <h1 className='text-4xl text-center mb-4'>Login</h1>
        <form className='max-w-md mx-auto ' onSubmit={handleLoginSubmit}>
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
          <button className='primary'>Login</button>
          <div className='text-center py-2 text-gray-500'>
            Don&apos;t have an account yet?
            <Link className='underline text-black' to={"/register"}>
              {" "}
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
