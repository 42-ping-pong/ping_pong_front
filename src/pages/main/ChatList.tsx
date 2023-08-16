import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { getJwtCookie } from '../../api/cookies';
import { useSetRecoilState } from 'recoil';
import { roomNameState } from '../../api/atoms';

import { SocketContext } from '../../api/SocketContext';

import ModalCreateRoom from '../../components/ModalCreateRoom';

interface Response {
    index: string;
    limit_user: number;
    room_stat: number;
}

const ChatList = () => {
    console.log('챗리스트 컴포넌트');

    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [rooms, setRooms] = useState<Response[]>([]);
    const { chatSocket } = useContext(SocketContext);
    const roomName = localStorage.getItem('room-name');

    const onJoinRoom = useCallback((roomName: string) => () => {
        chatSocket.emit('join-room', { roomName, password }, (response: any) => {
            console.log(response);
            if (response.success) {
                localStorage.setItem('room-name', roomName);
                navigate(`/room/${roomName}`);
            }
        });
    }, [navigate]);

    useEffect(() => {
        const roomListHandler = (res: any) => {
            console.log('room-list: ', res);
            setRooms(res);
        };
        chatSocket.emit('room-list', roomListHandler);

        chatSocket.on('room-list', (res: any) => {
            console.log('room-list on: ', res);
            // setRooms((prevRooms: any) => [...prevRooms, res]);
            setRooms(res);
        });
    }, [chatSocket]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event: any, roomName: string) => {
        event.preventDefault();
        console.log(roomName, password);
        chatSocket.emit('join-room', { roomName, password }, (response: any) => {
            console.log(response);
            if (response.success) {
                localStorage.setItem('room-name', roomName);
                navigate(`/room/${roomName}`);
            }
        });
    };

    return (
        <div style={{ border: '1px solid #000', padding: '10px' }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <h2>채팅방 목록</h2>
                <button onClick={handleOpen}>채팅방 생성</button>
                <ModalCreateRoom isOpen={open} onClose={handleClose} title={'채팅방 생성'} message={''} />
            </div>
            <table style={{ textAlign: 'center', width: '100%' }}>
                <thead>
                    <tr>
                        <th>방이름</th>
                        <th>제한인원</th>
                        <th>입장</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room: any, index: any) => (
                        <tr key={index}>
                            <td style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{room.room_stat === 1 ? <img src="https://media.istockphoto.com/id/936681148/vector/lock-icon.jpg?s=612x612&w=0&k=20&c=_0AmWrBagdcee-KDhBUfLawC7Gh8CNPLWls73lKaNVA=" alt="Special" style={{ width: '50px', height: '50px' }} /> : null}
                                {room.index}</td>
                            <td>{room.limit_user}</td>
                            <td>
                                {room.room_stat === 0 ? <button onClick={onJoinRoom(room.index)}>입장하기</button> : null}
                                {room.room_stat === 1 ? <form onSubmit={(e) => handleSubmit(e, room.index)}>
                                    <input type="password" placeholder="비밀번호" onChange={handleChange} />
                                    <button type="submit">입장하기</button>
                                </form> : null}
                                {room.room_stat === 2 ? <button onClick={onJoinRoom(room.index)}>입장하기</button> : null}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ChatList;
