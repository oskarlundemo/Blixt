import {Fragment, useState} from "react";


import '../../styles/Profile.css'
import {useNavigate} from "react-router-dom";

export const FollowMessageContainer = ({follows, handleFollow, conversationId, username}) => {

    const navigate = useNavigate();

    return (
        <div

            className="follow-message-container"
            style={{
                width: "100%",

            }}
        >

            {follows ? (
                <button
                    onClick={() => {
                        handleFollow()
                    }}
                >
                    Unfollow
                </button>
            ) : (
                <button
                    onClick={() => {
                        handleFollow()
                    }}>
                    Follow
                </button>
            )}

            <button
                style={{
                    backgroundColor: 'var(--accent-color)',
                    color: 'white'
                }}
                onClick={() => {
                    navigate(`/messages/${conversationId}`);
                }}>
                Message
            </button>
        </div>
    )
}