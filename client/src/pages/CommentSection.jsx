import {useEffect, useState} from "react";


import '../styles/CommentSection.css'
import {CommentInput} from "../components/CommentSectionComponents/CommentInput.jsx";
import {useParams} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import {CommentCard} from "../components/CommentSectionComponents/CommentCard.jsx";
import {supabase} from "../services/SupabaseClient.js";

export const CommentSection = ({}) => {

    const { user, loading } = useAuth();
    const [comments, setComments] = useState([]);
    const {postid} = useParams();
    const {API_URL} = useAuth();


    useEffect(() => {

        if (loading || !user) return;


        console.log('User:', user);
        console.log('Loading:', loading);
        console.log('Post ID:', postid);


        fetch(`${API_URL}/posts/comments/all/${postid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setComments(data.comments || []);
            })
            .catch(err => console.log(err));


        const accessToken = localStorage.getItem('token');

        console.log('Access Token:', accessToken);

        const commentsChannel = supabase.channel(`comments-${postid}`, {
            config: {
                params: {
                    authToken: accessToken,
                },
            },
        });
        commentsChannel.on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "Comments"
            },


            async (payload) => {
                const newComment = payload.new;
                console.log(newComment);

                try {
                    const res = await fetch(`${API_URL}/posts/comments/new/${postid}/${newComment.id}`); // Fetch the enirched message from backend
                    const data = await res.json();
                    setComments(prev => [...prev, data]);
                } catch (err) {
                    console.error("Error fetching group message:", err);
                }
            }
        ).subscribe((status) => {
            console.log('Subscription status:', status);
        });


        return () => {
            supabase.removeChannel(commentsChannel);
        };

    }, [postid, loading, user]);



    return (
        <main className="comment-section">

            <h1>This is a comment section</h1>

            {comments.length > 0 ? (

                (comments.map(comment => (
                    <CommentCard
                        key={comment.id}
                        comment={comment.comment}
                        timestamp={comment.created_at ? comment.created_at : undefined}
                        user={comment.user || null}
                    />
                )))
            ) : (
                <p>No comments yet! </p>
            )}

            <CommentInput postId={postid} />

        </main>
    )
}