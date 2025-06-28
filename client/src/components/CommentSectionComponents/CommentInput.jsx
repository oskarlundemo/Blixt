import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {UserAvatar} from "../UserAvatar.jsx";
import {useNavigate} from "react-router-dom";


export const CommentInput = ({postId, setComments}) => {

    const [comment, setComment] = useState('');
    const {API_URL, token, user} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (comment.trim() === "") {
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
                setComments((prevComments) => [...prevComments, data.comment]);
            })
            .catch(err => console.log(err));

        setComment('');
    }

    return (

        <form className={'comment-input'} onSubmit={handleSubmit}>

            <UserAvatar
                size={30}
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