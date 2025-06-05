

import '../styles/Feed.css'
import {Post} from "../components/FeedComponents/Post.jsx";
import {Link} from "react-router-dom";
import {NavigationBar} from "../components/NavigationBar.jsx";


export const Feed = ({}) => {



    return (
        <main className={'feed-wrapper'}>

            <section className={'feed'}>

                <Post
                    caption={'Carpe diem'}
                    username={'Lundemo'}
                />

            </section>

            <NavigationBar/>

        </main>
    )
}