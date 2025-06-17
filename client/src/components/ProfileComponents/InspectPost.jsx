import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {Post} from "../FeedComponents/Post.jsx";

import '../../styles/InspectPost.css'
import {LoadingTitle} from "../LoadingTitle.jsx";
import {HeaderMenu} from "../HeaderMenu.jsx";

export const InspectPost = ({}) => {

    const {API_URL, token} = useAuth();
    const {username, postid} = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        fetch(`${API_URL}/profile/inspect/${postid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setPost(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });

    }, [username, postid]);

    return (
        <main className="single-post">

            <HeaderMenu
                backArrow={true}
            />

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
                <p
                    style={{
                        textAlign: "center",
                        margin: '2rem'
                    }}
                >Post could not be retrieved</p>
            )}
        </main>
    );
}