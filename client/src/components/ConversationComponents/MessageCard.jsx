import {UserAvatar} from "../UserAvatar.jsx";
import moment from 'moment-timezone';
import {useAuth} from "../../context/AuthContext.jsx";
import {useEffect, useState} from "react";


/**
 * This component is used for rendering each message that is sent
 * inside a conversation
 *
 * @param sender, object containing the author / sender of the message
 * @param timestamp, date object of when the message was created
 * @returns {JSX.Element}
 * @constructor
 */

export const MessageCard = ({sender = null,
                                content = '' ,
                                timestamp = null}) => {

    const {user} = useAuth(); // Get the user from authContext.jsx
    const isSender = user?.id === sender?.id; // Variable to check if the user is the sender of the message
    const [isGif, setIsGif] = useState(false); // State to check if the message that was sent is a gif or not


    // This hook is used for determining if the message that was sent is a gif or not
    useEffect(() => {
        content?.endsWith(".gif") || content.includes('media.giphy.com') ? setIsGif(true) : setIsGif(false);
    }, [])

    // This function is used for formatting the timestamp of when the message was sent into a more UI friendly version
    const formatTimestamp = (isoTime) => {
        return moment(isoTime)
            .tz('Europe/Stockholm')
            .format('hh:mm A');
    };

    return (
        <div
            style={{
                ...(isSender ? {alignSelf: "flex-end",} : {alignSelf: "flex-start",})
            }}
            className="message-card">

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    gap: '1rem',
                    alignItems: "center",

                    ...(isSender ? {flexDirection: "row",} : {flexDirection: "row-reverse",})
                }}
                className={'card-header'}>

                <p>{formatTimestamp(timestamp)}</p>
                <UserAvatar user = {sender}/>

            </div>

            <div
                style={{
                    ...(isSender ? {
                        background: 'var(--accent-color)',
                        color: 'white',
                        alignSelf: "flex-end",
                    } : {
                        alignSelf: "flex-start",
                        background: 'var(--light-grey)',
                        color: 'black'
                    })
                }}

                className={`card-body ${isGif ? 'is-gif' : ''}`}>
                {/* If the message is a gif then render an image with the src, else just a plain p*/}
                {isGif ? (
                    <img
                        draggable={false}
                        src={content}
                        alt="GIF" style={{ maxWidth: '300px', borderRadius: '6px' }} />
                ) : (
                    <p>{content}</p>
                )}
            </div>

        </div>
    )
}