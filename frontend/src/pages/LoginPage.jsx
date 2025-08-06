import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from '../api/auth';
import PrimaryButton from '../components/Button'


const LoginPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await loginUser(username, password);
      console.log('login output:', res.data);
      navigate("/");
    } catch (err) {
      console.error('Login failed:', err);
      console.log('Error:', error.response.data);
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      return false
      
    };

    checkAuthStatus();
  }, [navigate]);

  return (
    <div className="p-6 bg-white shadow-card rounded-2xl">
      <input
        className="block w-full border mb-2 p-2"
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        className="block w-full border mb-4 p-2"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <PrimaryButton onClick={handleLogin} text="Login" />
    </div>
  );
};

export default LoginPage;


