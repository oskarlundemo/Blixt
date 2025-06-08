import {UserAvatar} from "../UserAvatar.jsx";
import moment from "moment-timezone";


export const CommentCard = ({

    comment = '',
    user = null,
    timestamp,
    feed = false,
                            }) => {



    const parseTimeStamp = (timestamp) => {
        const now = new Date();
        const created = new Date(timestamp);

        const diffInMs = now - created;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 60) {
            return `${diffInMinutes} min`;
        } else if (diffInHours < 24) {
            return `${diffInHours} h`;
        } else {
            return `${diffInDays} d`;
        }
    };

    return (
        <div className="comment-card">


            <div className="comment-card__header">

                {feed && (
                    <UserAvatar/>
                )}


                <div className={'comment-info'}>
                    <p>@{user?.username || 'No username'}</p>
                    <p>{parseTimeStamp(timestamp)}</p>
                </div>

            </div>


            <div className="comment-card__body">

                <p>{comment}</p>

            </div>

        </div>
    )
}


