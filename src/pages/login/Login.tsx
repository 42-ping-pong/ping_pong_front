import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getJwtCookie } from '../../api/cookies';

const Login = () => {
    type childrenModal = {
        children: React.ReactNode;
    };
    console.log('로그인 컴포넌트');
    const navigate = useNavigate();

    useEffect(() => {
        if (getJwtCookie('jwt')) {
            navigate('/main');
        }
    }, [navigate]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <h1>로그인 페이지</h1>
            <Link
                to={`https://api.intra.42.fr/oauth/authorize?client_id=${process.env.REACT_APP_OAUTH_ID}&redirect_uri=${process.env.REACT_APP_OAUTH_REDIRECT_URI}&response_type=code`}
            >
                <button style={{ width: '200px', height: '50px' }}>42Seoul Login</button>
            </Link>
        </div>
    );
};

export default Login;
