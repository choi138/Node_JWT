import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const [data, setData] = useState([]);
    const message = async () => {
        try {
            let res = await axios.get('http://127.0.0.1:3050');
            let data = res.data.message;
            setData(data);
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        message();
    }, []);

    return (
        <div>
            <h1>Home</h1>
            <p>{data}</p>
            <Link to="register">Register</Link>
            <br />
            <Link to="login">Login</Link>
        </div >
    )
}

export default Home