import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {Post} from "../FeedComponents/Post.jsx";
import '../../styles/InspectPost.css'
import {LoadingTitle} from "../LoadingTitle.jsx";
import {HeaderMenu} from "../HeaderMenu.jsx";
import {NoDataFound} from "../NoDataFound.jsx";

/**
 * This component is rendered once someone clicks at a post shown in a users
 * profile. Then they are taken to another page where there is only that post
 */

export const InspectPost = ({}) => {

    const {API_URL, token} = useAuth(); // Get token from authContext
    const {username, postid} = useParams(); // Get the username and id of the post from the URL
    const [post, setPost] = useState(null); // State to hold the post
    const [loading, setLoading] = useState(true); // State to set loading or not
    const [error, setError] = useState(false); // State to set error if something went wrong

    // This hook runs on mount, fetching the data that will be displayed
    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/profile/inspect/${postid}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await res.json();
                setPost(data);
            } catch (err) {
                console.error("Error fetching post:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [username, postid]);

    return (
        <main className="single-post">

            <HeaderMenu backArrow={true}/>

            {error ? (
                <NoDataFound
                    message={'There was a problem fetching that post'}
                    svg={
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M446-446Zm106-95Zm-106 95Zm106-95Zm-106 95Zm106-95ZM791-56 56-791l56-57 736 736-57 56Zm-311-64q-151 0-255.5-46.5T120-280v-400q0-26 17.5-49.5T187-773l252 252q-72-3-133-18t-106-40v120q51 29 123 44t157 15q20 0 39-.5t38-2.5l70 70q-34 7-71 10t-76 3q-85 0-157-15t-123-44v99q9 29 97.5 54.5T480-200q64 0 128.5-13T715-245l58 58q-49 31-125.5 49T480-120Zm350-123-70-70v-66q-11 6-22 11t-23 10l-61-61q30-8 56.5-17.5T760-459v-120q-41 23-94 37t-116 19l-76-76q44 0 92-7t89.5-18.5q41.5-11.5 70-26T760-679q-11-29-100.5-55T480-760q-37 0-75.5 5T331-742l-66-66q45-15 100-23.5t115-8.5q149 0 254.5 47T840-680v400q0 10-2.5 19t-7.5 18Z"/></svg>
                    }
                />
            ) :(
                (loading ? (
                <LoadingTitle/>
            ) : (
                post && (
                    <Post
                        username={post.poster?.username || null}
                        likes={post.likes}
                        comments={post.comments}
                        caption={post.caption}
                        images={post.images}
                        id={post.id}
                        post={post}
                        poster={post.poster || null}
                    />
                )))
            )}
        </main>
    );
}