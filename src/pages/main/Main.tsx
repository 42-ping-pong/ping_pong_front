import React, { useEffect, useState, useContext } from 'react';
import { getJwtCookie } from '../../api/cookies';
import axios from 'axios';
import ChatList from './ChatList';
import FriendList from './FriendList';
import LogOutButton from '../../components/LogOutButton';
import { useRecoilValue, useRecoilState } from 'recoil';
import { IFriendsState, usernameState, friendsState } from '../../api/atoms';
import { SocketContext } from '../../api/SocketContext';
import GameStartButton from './GameStartButton';

import ModalRoomInvitationReceiver from '../../components/ModalRoomInvitationReceiver';

const Main = () => {
    console.log('메인 컴포넌트');
    const { pingpongSocket, chatSocket } = useContext(SocketContext);
    // const [friends, setFriends] = useRecoilState<IFriendsState[]>(friendsState);
    const [friends, setFriends] = useState([]);
    const [dmName, setDMName] = useState<any>();
    const [openInvitation, setOpenInvitation] = useState(false);
    const [roomName, setRoomname] = useState('');
    const [sender, setSender] = useState('');

    useEffect(() => {
        // axios
        //     .get(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/friend/allfriend`, {
        //         headers: {
        //             Authorization: `Bearer ${getJwtCookie('jwt')}`,
        //         },
        //     })
        //     .then((res) => {
        //         console.log('/user/allfriend 요청 성공: ', res.data);
        //         setFriends(res.data);
        //     })
        //     .catch((err) => {
        //         console.log(`/user/allfriend 요청 실패: ${err}`);
        //     });

        chatSocket.on('ft_invitechat', (res: any) => {
            console.log('ft_invitechat on: ', res);
            setRoomname(res.index);
            setSender(res.sender);
            setOpenInvitation(true);
        });
    }, []);

    useEffect(() => {
        if (!pingpongSocket) {
            return () => {
                console.log('핑퐁소켓 없음.');
            };
        }

        pingpongSocket.on('ft_connect', (respnose: any) => {
            console.log('ft_connect 입니다.', respnose);
            const updatedFriends: any = friends.map((friend: any) => {
                if (friend.username === respnose.status) {
                    return { ...friend, status: 1 };
                }
                return friend;
            });
            setFriends([...updatedFriends]);
        });

        pingpongSocket.on('ft_disconnect', (respnose: any) => {
            console.log('ft_disconnect 입니다.', respnose);
            const updatedFriends: any = friends.map((friend: any) => {
                if (friend.username === respnose.status) {
                    return { ...friend, status: 0 };
                }
                return friend;
            });
            setFriends([...updatedFriends]);
        });

        return () => {
            pingpongSocket.off('ft_connect');
            pingpongSocket.off('ft_disconnect');
        };
    }, [friends]);

    const handleClose = () => {
        setOpenInvitation(false);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <ModalRoomInvitationReceiver isOpen={openInvitation} onClose={handleClose} title={'채팅방 초대'} roomName={roomName} sender={sender} />
            <GameStartButton />
            <LogOutButton />
            <h1> {localStorage.getItem('username')}의 메인 페이지</h1>
            {chatSocket ? <ChatList /> : null}
            <div style={{ margin: '30px 0' }} />
            <FriendList dmName={dmName} setDMName={setDMName} />
            <div style={{ margin: '30px 0' }} />
        </div>
    );
};

export default Main;
