import {UserAvatar} from "../UserAvatar.jsx";
import moment from 'moment-timezone';
import {useAuth} from "../../context/AuthContext.jsx";
import {useEffect, useState} from "react";


export const MessageCard = ({sender = null, content = '' , timestamp}) => {

    const {user} = useAuth();
    const isSender = user?.id === sender?.id;
    const [isGif, setIsGif] = useState(false);


    useEffect(() => {
        content?.endsWith(".gif") || content.includes('media.giphy.com') ? setIsGif(true) : setIsGif(false);
    }, [])

    const formatTimestamp = (isoTime) => {
        return moment(isoTime)
            .tz('Europe/Stockholm')
            .format('hh:mm A');
    };


    return (
        <div

            style={{
                ...(isSender ? {
                    alignSelf: "flex-end",
                } : {
                    alignSelf: "flex-start",
                })
            }}


            className="message-card">

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    gap: '1rem',
                    alignItems: "center",

                    ...(isSender ? {
                        flexDirection: "row",
                    } : {
                        flexDirection: "row-reverse",
                    })
                }}
                className={'card-header'}>

                <p>{formatTimestamp(timestamp)}</p>

                <UserAvatar size={25} user = {sender}/>
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