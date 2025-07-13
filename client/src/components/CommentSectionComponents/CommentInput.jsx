import {useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {UserAvatar} from "../UserAvatar.jsx";
import toast from "react-hot-toast";

/**
 * This component is the UI the users writes their comments into
 * when they want to comment on a post
 *
 * @param postId the id of the post they are writing the comment on
 * @param setComments update and append the new comment to the existing ones
 * @returns {JSX.Element}
 */



export const CommentInput = ({postId, setComments}) => {

    const [comment, setComment] = useState(''); // State to hold the comment itself
    const {API_URL, token, user} = useAuth(); // Get the token and user from AuthContext.jsx

    // This function handles the submission of a new comment
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (comment.trim() === "") { // Prevent posting comments that are empty
            return;
        }

        await fetch(`${API_URL}/posts/comment/new/${postId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                comment,
            })
        })

            .then(res => res.json())
            .then(data => {
                setComments((prevComments) => [...prevComments, data.comment]); // Insertion went ok, append the data of the new comment into the other ones
            })
            .catch(err => {
                toast.error('There was an error submitting your comment, try again later') // Show a UI friendly error message
                console.log('An error occured while creating comment');
            });

        setComment(''); // Reset the comment for
    }

    return (

        <form className={'comment-input'} onSubmit={handleSubmit}>

            <UserAvatar
                user={user
            }/>

            <div className="input-comment-container">
                <textarea
                    className={'text-area-input'}
                    placeholder='Write a comment...'
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />

                <p
                    onClick={(e) => {
                        handleSubmit(e);
                    }}
                    className={comment.length > 0 ? 'active' : ''}>Post</p>
            </div>

        </form>

    )

}