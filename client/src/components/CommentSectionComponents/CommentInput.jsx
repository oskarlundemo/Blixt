import {Inputfield} from "../InputField.jsx";
import {useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";


export const CommentInput = ({postId}) => {

    const [comment, setComment] = useState('');

    const {API_URL, user} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (comment.trim() === "") {
            return;
        }

        const response = await fetch(`${API_URL}/posts/comment/new/${postId}/${user.sub}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                comment,
            })
        })

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Server Error: ${response.status} - ${text}`);
        }
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