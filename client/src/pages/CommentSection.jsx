import {use, useEffect, useState} from "react";


import '../styles/CommentSection.css'
import {CommentInput} from "../components/CommentSectionComponents/CommentInput.jsx";
import {useParams} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import {CommentCard} from "../components/CommentSectionComponents/CommentCard.jsx";
import {supabase} from "../services/SupabaseClient.js";

export const CommentSection = ({}) => {

    const [comments, setComments] = useState([]);
    const {postid} = useParams();
    const {API_URL} = useAuth();


    useEffect(() => {

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

        const commentsChannel = supabase.channel(`comments.${postid}`);

        localStorage.setItem("supabase.realtime.debug", "true");



        commentsChannel.on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "Comments"
            },
            async (payload) => {
                const newComment = payload.new; // New group message
                console.log(newComment);

                try {
                    const res = await fetch(`${API_URL}/posts/comments/new/${postid}/${newComment.id}`); // Fetch the enirched message from backend
                    const data = await res.json();
                    // Add it to the messages displayed in the chat window
                    setComments(prev => [...prev, data]);
                } catch (err) {
                    console.error("Error fetching group message:", err);
                }
            }
        ).subscribe();


        return () => {
            supabase.removeChannel(commentsChannel);
        };

    }, [postid]);


    useEffect(() => {
        const channels = supabase.channel('custom-insert-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'Comments' },
                (payload) => {
                    console.log('Change received!', payload)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channels);
        }
    }, []);

    useEffect(() => {
        const channel = supabase
            .channel('debug-comments')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'Comments',
                },
                (payload) => {
                    console.log('New comment inserted:', payload);
                }
            )
            .subscribe((status) => {
                console.log('Subscription status:', status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);


    console.log(postid);

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