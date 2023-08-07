import { Backdrop, Box, Button, Container, Typography } from '@mui/material';
import { SocketContext } from '../../api/SocketContext';
import { settingRoomNameState } from '../../api/atoms';
import { createGameSocket } from '../../api/socket';
import React, { useCallback, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router';

const OwnerPlayer = ({
    onReady,
    handleBackdropOpen,
    handleBackdropClose,
    onReadyToggle,
    backdrop,
    initGame,
    setInitGame,
}) => {
    const { gameSocket } = useContext(SocketContext);
    const RsettingRoomName = useRecoilValue(settingRoomNameState);
    const navigate = useNavigate();

    const initGameHandler = useCallback(() => {
        gameSocket.emit('ft_game_play', RsettingRoomName, (response: any) => {
            if (!response.success) return alert(response.payload);
        });
        console.log('게임 생성 완료');
        navigate(`/game-room/${RsettingRoomName}`);
    }, [gameSocket]);
    return (
        <Container
            sx={{
                width: '60vw',
                height: '50vh',
                backgroundColor: 'darkgray',
                display: 'flex',
                justifyCcontent: ' center',
                alignItems: 'center',
            }}
        >
            {onReady && (
                <div>
                    <Button onClick={handleBackdropOpen}>Show backdrop</Button>

                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={backdrop}
                        onClick={handleBackdropClose}
                    >
                        <div>Ready</div>
                    </Backdrop>
                </div>
            )}
            <Box
                sx={{
                    width: '100%',
                    height: '90%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <Box sx={{ width: '100%', height: '15%', justifyContent: 'space-between', display: 'flex' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '15%', alignItems: 'center' }}>
                        <img
                            src="https://www.gravatar.com/avatar/HASH"
                            alt="user_image"
                            style={{ width: '30%', borderRadius: '50%' }}
                        />
                        <Typography variant="h6">김핑퐁</Typography>
                    </Box>
                    <Button
                        variant="contained"
                        onClick={initGameHandler}
                        style={{
                            backgroundColor: onReady ? '' : 'lightgray', // 대기중일 때 색상 제거
                        }}
                    >
                        {initGame ? '게임시작' : '안댕'}
                    </Button>
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        height: '60%',
                        backgroundColor: 'lightgray',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ width: '80%', height: '90%', margin: '0 auto' }}>
                        <Typography variant="h6">전적</Typography>
                        <Box sx={{ width: '100%', display: 'flex', justifyCcontent: 'space-around' }}>
                            <p>23.07.10</p>
                            <p>WIN</p>
                            <p>김핑퐁</p>
                        </Box>
                        <Box sx={{ width: '100%', display: 'flex', justifyCcontent: 'space-around' }}>
                            <p>23.07.10</p>
                            <p>WIN</p>
                            <p>김핑퐁</p>
                        </Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        height: '15%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'lightgray',
                    }}
                >
                    <Box
                        sx={{
                            width: '80%',
                            height: '100%',
                            margin: '0 auto',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h6" sx={{ width: '20%' }}>
                            업적
                        </Typography>
                        <Box sx={{ display: 'flex', width: '30%', height: '100%' }}>
                            <Box
                                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}
                            >
                                <img
                                    src="https://www.gravatar.com/avatar/HASH"
                                    alt="user_image"
                                    style={{ width: '30%', borderRadius: '50%', marginTop: '5px' }}
                                />
                                <p>수다의 신</p>
                            </Box>
                            <Box
                                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}
                            >
                                <img
                                    src="https://www.gravatar.com/avatar/HASH"
                                    alt="user_image"
                                    style={{ width: '30%', borderRadius: '50%', marginTop: '5px' }}
                                />
                                <p>장사의 신</p>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default OwnerPlayer;
