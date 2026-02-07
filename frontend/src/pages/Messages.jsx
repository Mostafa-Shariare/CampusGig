import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Messages.css';

const Messages = () => {
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        if (user) {
            fetchConversations();
        }
    }, [token, user]);

    const fetchConversations = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/conversations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setConversations(response.data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const getOtherParticipant = (participants) => {
        if (!user) return null;
        return participants.find(p => p._id !== user._id);
    };

    if (loading || !user) {
        return <div className="messages-page"><p className="loading">Loading...</p></div>;
    }

    return (
        <div className="messages-page">
            <div className="messages-container">
                <div className="messages-header">
                    <h1>Messages</h1>
                </div>

                {conversations.length === 0 ? (
                    <div className="no-conversations">
                        <p>No conversations yet</p>
                        <p className="hint">Start a conversation by visiting a user's profile and clicking "Message"</p>
                    </div>
                ) : (
                    <div className="conversations-list">
                        {conversations.map(conversation => {
                            const otherUser = getOtherParticipant(conversation.participants);
                            if (!otherUser) return null;

                            return (
                                <Link
                                    key={conversation._id}
                                    to={`/messages/${conversation._id}`}
                                    className="conversation-item"
                                >
                                    <img
                                        src={otherUser.avatar || '/default-avatar.png'}
                                        alt={otherUser.username}
                                        className="conversation-avatar"
                                    />
                                    <div className="conversation-info">
                                        <h3>{otherUser.username}</h3>
                                        <p className="last-message">
                                            {conversation.lastMessage || 'No messages yet'}
                                        </p>
                                    </div>
                                    <span className="conversation-time">
                                        {new Date(conversation.lastMessageTime).toLocaleDateString()}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
