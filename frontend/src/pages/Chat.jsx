import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Chat.css';

const Chat = () => {
    const { conversationId } = useParams();
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [otherUser, setOtherUser] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        if (user) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [conversationId, token, user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        if (!user) return;

        try {
            const response = await axios.get(
                `http://localhost:3000/api/conversations/${conversationId}/messages`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setMessages(response.data);

            if (response.data.length > 0 && !otherUser) {
                const firstMsg = response.data[0];
                const other = firstMsg.sender._id === user._id ? firstMsg.receiver : firstMsg.sender;
                setOtherUser(other);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const response = await axios.post(
                `http://localhost:3000/api/conversations/${conversationId}/messages`,
                { content: newMessage },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    if (loading || !user) {
        return <div className="chat-page"><p className="loading">Loading...</p></div>;
    }

    return (
        <div className="chat-page">
            <div className="chat-container">
                <div className="chat-header">
                    <button onClick={() => navigate('/messages')} className="back-button">
                        ← Back
                    </button>
                    {otherUser && (
                        <div className="chat-user-info">
                            <img src={otherUser.avatar || '/default-avatar.png'} alt={otherUser.username} />
                            <h2>{otherUser.username}</h2>
                        </div>
                    )}
                </div>

                <div className="messages-container">
                    {messages.length === 0 ? (
                        <p className="no-messages">No messages yet. Start the conversation!</p>
                    ) : (
                        messages.map(message => (
                            <div
                                key={message._id}
                                className={`message ${message.sender._id === user._id ? 'sent' : 'received'}`}
                            >
                                <div className="message-content">
                                    <p>{message.content}</p>
                                    <span className="message-time">
                                        {new Date(message.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="message-input-form">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        disabled={sending}
                    />
                    <button type="submit" disabled={sending || !newMessage.trim()}>
                        {sending ? 'Sending...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
