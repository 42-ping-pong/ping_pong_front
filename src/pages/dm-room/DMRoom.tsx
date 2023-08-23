import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { } from 'react-router-dom';
import { } from '../../api/atoms';
import { useSearchParams, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { dmNameState } from '../../api/atoms';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { SocketContext } from '../../api/SocketContext';

const DMRoom = () => {
    const { chatSocket } = useContext(SocketContext);
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState('');
    const chatContainerEl = useRef(null);
    const index = localStorage.getItem('dm-index');
    const receiver = localStorage.getItem('dm-username');
    const navigate = useNavigate();

    useEffect(() => {
        if (!chatContainerEl.current) return;

        const chatContainer = chatContainerEl.current;
        const { scrollHeight, clientHeight } = chatContainer;

        if (scrollHeight > clientHeight) {
            chatContainer.scrollTop = scrollHeight - clientHeight;
        }
    }, [chats.length]);

    useEffect(() => {
        setMessage('');
        const data = {
            roomName:index
        }; // { roomName: index }
        chatSocket.emit('ft_get_dm_log', data, (chat) => {
            console.log('ft_get_dm_log: ', chat);
            setChats(chat);
        });

        const messageHandler = (chat: any) => {
            console.log('디엠룸 메세지 핸들러: ', chat);
            setChats((prevChats) => [...prevChats, chat]);
        };

        chatSocket.on('ft_dm', messageHandler);

        chatSocket.on('ft_tomain', (res: any) => {
            console.log('ft_tomain on: ', res);
            if (res) {
                navigate('/main');
            }
        });


        // return () => {
        //     console.log('message off');
        //     chatSocket.off('ft_dm', messageHandler);
        // };

        // //// nhwang index->data (상단으로 옮겼습니다. ft_get_dm_log에서도 같은 형국이라)
        return () => {
            chatSocket.emit('leave-dm', data, () => {
                console.log('leave-dm: ', data);
            });
        };
    }, []);

    const onChange = useCallback((e) => {
        setMessage(e.target.value);
    }, [message]);

    const onSendMessage = useCallback(
        async (e) => {
            e.preventDefault();

            if (message === '') return alert('메시지를 입력해 주세요.');
            /// nhwang { roomName: index, message, receiver } -> data
            const data = {
                roomName:index,
                message,
                receiver,
            };
            ///
            await chatSocket.emit('ft_dm', data, (chat) => {
                setChats((prevChats) => [...prevChats, chat]);
                setMessage('');
            });
        },
        [index, message], ////이 부분은 안 건드렸어요 nhwang (data로 변경하는 부분에서 건드리지 않음.)
    );

    const onLeaveRoom = useCallback(() => {
        // chatSocket.emit('leave-dm', index, () => {
            navigate('/main');
        // });
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
            <h2>{receiver}님과의 DM</h2>
            <div ref={chatContainerEl}>
                {chats.map((chat, index) => (
                    <div key={index}>
                        <span style={{ fontWeight: 'bold', color: 'green' }}>{chat.username} : </span>
                        <span style={{ fontWeight: 'bold', color: 'black' }}>{chat.message}</span>
                        <div style={{ margin: '10px 0' }} />
                    </div>
                ))}
            </div>
            <div>
                <form onSubmit={onSendMessage}>
                    <input type="text" onChange={onChange} value={message} />
                    <button>Send</button>
                </form>
                <div>
                    <button onClick={onLeaveRoom} style={{ position: 'absolute', right: '12px', bottom: '35vh' }}>
                        나가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DMRoom;
