

import '../styles/Feed.css'
import {Post} from "../components/FeedComponents/Post.jsx";
import {NavigationBar} from "../components/NavigationBar.jsx";
import {useState} from "react";


export const Feed = ({}) => {


    const [posts, setPosts] = useState([]);


    return (
        <main className={'feed-wrapper'}>

            <section className={'feed'}>


                {posts.length > 0 ? (
                    <Post
                        caption={'Carpe diem'}
                        username={'Lundemo'}
                    />
                ) : (
                    <p
                    style={
                        {
                            textAlign: 'center',
                            alignSelf: 'center',
                        }
                    }>No posts yet, create on or follow others!</p>
                )}


            </section>

            <NavigationBar/>

        </main>
    )
}