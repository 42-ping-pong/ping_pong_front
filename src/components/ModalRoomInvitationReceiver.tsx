import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Box, Typography, TextField, Switch, FormControlLabel, Alert } from '@mui/material';
import { SocketContext } from '../api/SocketContext';

import ModalError from './ModalError';

interface ModalExampleProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    roomName: string;
    sender: string;
}

interface Response {
    success: boolean;
    payload: string;
}

const ModalRoomInvitationReceiver: React.FC<ModalExampleProps> = ({ isOpen, onClose, title, roomName, sender }) => {
    const { chatSocket } = useContext(SocketContext);
    const navigate = useNavigate();
    const password = '';

    const [openError, setOpenError] = useState(false);
    const [message, setMessage] = useState('');

    const onAccept = () => {
        chatSocket.emit('join-room', { roomName, password }, (response: any) => {
            console.log(response);
            if (response.success) {
                localStorage.setItem('room-name', roomName);
                navigate(`/room/${roomName}`);
                // onClose();
            } else {
                setOpenError(true);
                setMessage(response.faillog);
                return;
            }
        });
    };

    const handleClose = () => {
        setOpenError(false);
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 300, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <ModalError isOpen={openError} onClose={handleClose} title={'에러'} message={message} />
                <Typography id="modal-title" variant="h6" component="h2">
                    {title}
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2 }}>
                    {sender + '님의 채팅방 초대를 수락하시겠습니까?'}
                </Typography>

                <Box sx={{ position: 'absolute', bottom: 20, right: 10 }}>
                    <Button variant="contained" onClick={onAccept} sx={{ mt: 2 }}>수락</Button>
                    <Button variant="contained" onClick={onClose} sx={{
                        mt: 2,
                        mx: 1,
                        backgroundColor: 'red',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'red', // Keep the same color on hover
                        },
                    }}>거절</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalRoomInvitationReceiver;