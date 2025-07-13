import {UserAvatar} from "../UserAvatar.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
import {useParams} from "react-router-dom";
import toast from "react-hot-toast";


/**
 * This component is used for rendering comments inside the CommentSection.jsx beneath
 * Post.jsx components
 *
 * @param comment
 * @param author
 * @param timestamp
 * @param commentSection
 * @param id
 * @param isUsersPost
 * @param feed
 * @param setComments
 * @returns {JSX.Element}
 * @constructor
 */


export const CommentCard = ({
                                comment = '', // Comment
                                author = null, // Object containing the user who wrote the comment
                                timestamp, // The timestamp the comment was inserted into db
                                commentSection = false, // If the comment is shown in feed, do not show controlls
                                id = 0, // Id of the comment
                                isUsersPost = false, // If the comment is written by the logged in user
                                feed = false, // Is the comment in a post shown in the feed
                                setComments = [], // Update comments for the post if one is deleted or added for that post
                            }) => {

    const {user, API_URL, token} = useAuth(); // Get the user and their token from the authcontext
    const {postid} = useParams(); // The id of the post the comment is on through params

    /**
     * Parse the date object sent from the backend into a more readable UI format and
     * show ex 5 min ago
     *
     * @param timestamp Date object
     * @returns {string}
     */
    const parseTimeStamp = (timestamp) => {

        const now = new Date(); // Create a new date object to compare the timestamp
        const created = new Date(timestamp); // Convert for safety

        // Calculate the time that has passed since comment was posted
        const diffInMs = now - created;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);


        if (diffInMinutes < 60) { // Within an hour show the minutes or 'Just now
            if (diffInMinutes <= 0) {
                return 'Just now'
            }
            return `${diffInMinutes} min`;
        } else if (diffInHours < 24) { // Show hours
            return `${diffInHours} h`;
        } else { // Just show the days since
            return `${diffInDays} d`;
        }
    };

    /**
     * Function that handles the deletion of a comment
     *
     * @param commentId
     * @returns {Promise<void>}
     */

    const deleteCommentHandler = async (commentId) => {
        await fetch(`${API_URL}/posts/comments/delete/${commentId}/${postid}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setComments((prevComments) => prevComments.filter(comment => comment.id !== commentId)); // If response was ok, remove that comment from the array of comments
            })
            .catch(err => {
                toast.error('There was an error while deleting the comment'); // If the user is not authorized or an error occured, show a toast
                console.log(
                    'There was an error while deleting the comment'
                )
            });
    }




    return (
        <div className="comment-card">

            <div className="comment-card__header">

                {commentSection && (
                    <UserAvatar
                        user={author}
                        size={30}
                    />
                )}

                <div className={'comment-info'}>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexGrow: '1',
                        }}

                        className="content-body">
                        <p
                            style={{
                                textWrap: 'break-word',
                            }}>

                        <span
                            style={{
                                fontWeight: 'bold',
                            }}>
                            {author?.username}:
                        </span>
                            {' ' + comment}
                        </p>
                    </div>


                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '0.5rem',
                            alignSelf: 'flex-start',
                        }}>

                        {/*If the comment is not shown in a feed, then the author of that comment can delete it*/}
                        {!feed && (
                            <p>{parseTimeStamp(timestamp)}</p>
                        )}

                        {/*Only the author of the comment or the admin of post can delete this comment*/}
                        {((isUsersPost || author?.id === user?.id) && !feed) && (
                            <svg
                                className={'delete-comment-icon'}
                                onClick={() => deleteCommentHandler(id)}
                                xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-440v-80h560v80H200Z"/></svg>)}

                          </div>

                </div>

            </div>

        </div>
    )
}


