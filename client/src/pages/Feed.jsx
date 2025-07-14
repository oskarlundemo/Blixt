import '../styles/Feed.css'
import {Post} from "../components/FeedComponents/Post.jsx";
import {NavigationBar} from "../components/NavigationBar.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {LoadingTitle} from "../components/LoadingTitle.jsx";
import {HeaderMenu} from "../components/HeaderMenu.jsx";


/**
 * This component is the main page where the user can scroll through posts
 * from other users they follow
 *
 * @returns {JSX.Element}
 * @constructor
 */



export const Feed = ({}) => {

    const [loading, setLoading] = useState(true);
    const {API_URL, token} = useAuth();
    const [posts, setPosts] = useState([]);

    useEffect(() => {

        fetch(`${API_URL}/feed/load`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [])


    return (
        <main className={'feed-wrapper'}>

            <HeaderMenu/>

            <section className={'feed'}>

                {loading ? (
                    <LoadingTitle/>
                ) : (
                    (posts.length > 0 ? (
                            posts.map((post, index) => (
                                <Post
                                    key={index}
                                    username={post.poster?.username || null}
                                    picture={post.images?.length > 0 ? post.images[0].url : null}
                                    likes={post.likes}
                                    comments={post.comments}
                                    caption={post.caption}
                                    images={post.images}
                                    post={post}
                                    poster={post.poster}
                                    id={post.id}
                                    setPosts={setPosts}
                                    inFeed={true}
                                />
                            ))
                        ) : (
                            <p
                                style={
                                    {
                                        textAlign: 'center',
                                        alignSelf: 'center',
                                    }}>
                                No posts yet, create one or follow others!
                            </p>
                    ))
                )}

            </section>

            <NavigationBar/>

        </main>
    )
}