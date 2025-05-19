import { useNavigate } from 'react-router-dom';
import './css/NotFound.css';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="notfound-container">
            <h1>404 :(</h1>
            <p>page not found noooo</p>
            <p>send a dm on discord please! co.29</p>
            <button onClick={() => navigate('/')}>go home</button>
        </div>
    );
}