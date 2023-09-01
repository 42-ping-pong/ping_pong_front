import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import { getJwtCookie } from './api/cookies';

import Login from './pages/login/Login';
import Main from './pages/main/Main';
import ChatRoom from './pages/chat-room/ChatRoom';
import DMRoom from './pages/dm-room/DMRoom';
import OAuth from './components/OAuth';
import TwoFactorAuth from './pages/two-factor-auth/TwoFactorAuth';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './components/NotFound';
import { SocketContext } from './api/SocketContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import { createPingpongSocket, createChatSocket, createGameSocket } from './api/socket';
import SettingRoomLayout from './pages/setting-room/layout';
import GameRoomLayout from './pages/game-room/layout';
import MyPage from './pages/mypage/MyPage'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
            suspense: true,
        },
    },
});

function App() {
    console.log('앱 컴포넌트');

    const pingpongSocket = createPingpongSocket();
    const chatSocket = createChatSocket();
    const gameSocket = createGameSocket();

    if (getJwtCookie('jwt')) {
        console.log('jwt쿠키있음')
        pingpongSocket.auth = { token: `${getJwtCookie('jwt')}` };
        pingpongSocket.connect();
        chatSocket.auth = { token: `${getJwtCookie('jwt')}` };
        chatSocket.connect();
        gameSocket.auth = { token: `${getJwtCookie('jwt')}` };
        gameSocket.connect();
    }

    useEffect(() => {
        console.log('게임 소켓 감지기', gameSocket);
        console.log('채팅 소켓 감지기', chatSocket);
        console.log('핑퐁 소켓 감지기', pingpongSocket);
    }, [gameSocket, pingpongSocket, chatSocket]);

    
    return (
        <RecoilRoot>
            <ThemeProvider theme={theme}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                        width: '100vw',
                    }}
                >
                    <SocketContext.Provider value={{ pingpongSocket, chatSocket, gameSocket }}>
                        <BrowserRouter>
                            <QueryClientProvider client={queryClient}>
                                <Suspense fallback={<h1>Loading</h1>}>
                                    <Routes>
                                        <Route path="/" element={<Login />}></Route>
                                        <Route path="/redirect" element={<OAuth />}></Route>
                                        <Route path="/two-factor-auth" element={<TwoFactorAuth />} />
                                         <Route element={<PrivateRoute />}> 
                                            <Route path="/main" element={<Main />} />
                                            <Route path="/room/:roomName" element={<ChatRoom />} />
                                            <Route path="/dm/:dmName" element={<DMRoom />} />
                                            <Route path="/setting-room/:roomName" element={<SettingRoomLayout />} />
                                            <Route path="/game-room/:roomName" element={<GameRoomLayout />} />
                                            <Route path="/myPage" element={<MyPage/>} />
                                         </Route> 
                                        <Route path="*" element={<NotFound />} />
                                    </Routes>
                                </Suspense>
                            </QueryClientProvider>
                        </BrowserRouter>
                    </SocketContext.Provider>
                </div>
            </ThemeProvider>
        </RecoilRoot>
    );
}

export default App;
