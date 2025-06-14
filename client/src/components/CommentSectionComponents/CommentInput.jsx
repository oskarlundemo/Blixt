import {Inputfield} from "../InputField.jsx";
import {useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";


export const CommentInput = ({postId, setComments}) => {

    const [comment, setComment] = useState('');

    const {API_URL, token} = useAuth();

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

            <Inputfield
                type="text"
                title='Comment'
                id='comment'
                name='comment'
                value={comment}
                onChange={e => setComment(e.target.value)}
                example={'Share your thoughts 💭'}
            />

        </form>

    )

}