

import '../styles/Profile.css'
import {NavigationBar} from "../components/NavigationBar.jsx";



export const Profile = ({}) => {



    return (
        <main className="profile">

            <header>

                <section className={'profile-header'}>

                    <div className="profile-avatar">

                        <img src={'/sigge.jpeg'}
                             style={{
                                 height: '50px',
                                 width: '50px',
                                 borderRadius: '50%',

                             }}
                             draggable={false}
                        />

                    </div>

                    <div className="profile-followers">

                        <div>
                            <p>3</p>
                            <p>Posts</p>
                        </div>

                        <div>
                            <p>10</p>
                            <p>Followers</p>
                        </div>

                        <div>
                            <p>9</p>
                            <p>Following</p>
                        </div>


                        <button>
                            Follow
                        </button>

                    </div>

                </section>

                <div className="profile-bio">

                    <h1
                        style={{
                            textAlign: "left",
                            margin: "10px auto",
                            fontSize: '1.5rem',
                        }}
                    >@lundemo</h1>

                    <p>This is my bio 😩 😜</p>
                </div>

            </header>


            <section className="profile-content-grid">

                <img
                    src={'/sigge.jpeg'}
                />


                <img
                    src={'/sigge.jpeg'}
                />

                <img
                    src={'/sigge.jpeg'}
                />

                <img
                    src={'/sigge.jpeg'}
                />

                <img
                    src={'/sigge.jpeg'}
                />

            </section>


            <NavigationBar/>

        </main>

    )
}