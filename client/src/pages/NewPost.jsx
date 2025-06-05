
import '../styles/NewPost.css'
import {useState} from "react";
import {NavigationBar} from "../components/NavigationBar.jsx";




export const NewPost = ({}) => {


    const [caption, setCaption] = useState('')



    return (
        <main className="new-post-container">


            <section className={'new-post-images-container'}>

                <div className={'image-grid-container'}>

                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                   

                </div>

                <span>0 / 10</span>

            </section>


            <section className="new-post-description">


                <form>
                    <fieldset>
                        <legend>Description</legend>
                        <textarea
                            name="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Write something about your post..."
                            rows="5"
                            cols="50"
                        />
                    </fieldset>

                    <button>Post</button>

                </form>

            </section>


            <NavigationBar/>

        </main>
    )
}