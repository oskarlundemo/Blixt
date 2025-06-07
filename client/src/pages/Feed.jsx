

import '../styles/Feed.css'
import {Post} from "../components/FeedComponents/Post.jsx";
import {NavigationBar} from "../components/NavigationBar.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";

export const Feed = ({}) => {


    const [loading, setLoading] = useState(true);
    const {user, API_URL} = useAuth();
    const [posts, setPosts] = useState([]);

    useEffect(() => {

        fetch(`${API_URL}/profile/fetch/posts/${user.sub}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setPosts(data.posts);
                setLoading(false);
                console.log(data.posts);
            })
            .catch(err => console.log(err));

    }, [])


    return (
        <main className={'feed-wrapper'}>

            <section className={'feed'}>

                {loading ? (
                    <p>Loading..</p>
                ) : (
                    (posts.length > 0 ? (
                            posts.map((post, index) => (
                                <Post
                                    key={index}
                                    user={post.poster?.username || null}
                                    picture={post.images?.length > 0 ? post.images[0].url : null}
                                    likes={post.likes}
                                    comments={post.comments}
                                    caption={post.caption}
                                    images={post.images}
                                />
                            ))
                        ) : (
                            <p
                                style={
                                    {
                                        textAlign: 'center',
                                        alignSelf: 'center',
                                    }}>
                                No posts yet, create on or follow others!
                            </p>
                    ))
                )}


            </section>

            <NavigationBar/>

        </main>
    )
}