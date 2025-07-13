import {UserAvatar} from "../UserAvatar.jsx";
import {parseTimeStamp} from "../FeedComponents/Post.jsx";
import {useNavigate} from "react-router-dom";


/**
 * This component is used for each notification a user
 * has received in the Notifications.jsx page.
 *
 * @param timestamp when the follow, like or comment happned
 * @param user who made the action
 * @param action type of action, follow, like etc
 * @param thumbnail of the post they liked
 * @param post, an object containg the data of the post
 * @returns {JSX.Element}
 * @constructor
 */

export const NotificationCard = ({timestamp, user, action, thumbnail, post}) => {

    const navigate = useNavigate();  // Used to navigate to chats after creation is successful

    // This function just parses the type of action into a more UI friendly scentance
    const parseAction = (type) => {
        if (type === "COMMENT") {
            return 'commented on your post'
        } else if (type === "LIKE") {
            return 'liked your post'
        } else if (type === "FOLLOW") {
            return 'follows you'
        }
    }


    return (
        <article
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
            }}
            onClick={() => navigate(`/${user.username}/${post.id}`)}
            className={'notification-card'}>

            <div className={'notification-card-content'}>
                <UserAvatar user={user}/>
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                }}
                className={'notification-card-content'}>

                <p>{user.username + ' ' + parseAction(action)}</p>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '1rem',
                    }}

                    className={'notification-card-image'}>

                    <p>{parseTimeStamp(timestamp)}</p>

                    <img
                        src={thumbnail}
                        alt={thumbnail}
                        style={{
                            width: '50px',
                            height: '50px',
                            aspectRatio: '1 / 1',
                            borderRadius: '5px',
                            objectFit: 'cover'
                        }}
                        draggable={false}
                    />
                </div>

            </div>

        </article>
    )
}