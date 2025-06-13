import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {Post} from "../FeedComponents/Post.jsx";

import '../../styles/InspectPost.css'
import {LoadingTitle} from "../LoadingTitle.jsx";

export const InspectPost = ({}) => {

    const {API_URL, user} = useAuth();
    const {username, postid} = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        fetch(`${API_URL}/profile/inspect/${postid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setPost(data);
                console.log(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });

    }, [username, postid]);

    return (
        <main className="single-post">
            {loading ? (
                <LoadingTitle/>
            ) : post ? (
                <Post
                    username={post.poster?.username || null}
                    likes={post.likes}
                    comments={post.comments}
                    caption={post.caption}
                    images={post.images}
                    id={post.id}
                    post={post}
                    poster={post.poster}
                />
            ) : (
                <p>Post not found</p>
            )}
        </main>
    );
}