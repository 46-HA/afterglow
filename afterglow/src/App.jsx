import "./index.css"
import { Routes, Route, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <h1>afterglow.</h1>
      <p>change the trajectory of your life.</p>
      <p>build good habits.</p>
      
      <button onClick={() => navigate('/login')}>Log In</button>
    </div>
  );
}

function Login() {
  return (
    <div className="login">
      <h2>login.</h2>
      <p>enter username</p>
    </div>
  );
}

export default function App() {
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}