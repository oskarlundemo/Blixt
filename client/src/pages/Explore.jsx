

import '../styles/Explore.css'
import {NavigationBar} from "../components/NavigationBar.jsx";
import {useEffect, useState} from "react";
import {Inputfield} from "../components/InputField.jsx";
import {ExploreImageGrid} from "../components/ExploreComponents/ExploreImageGrid.jsx";
import {Overlay} from "../components/Overlay.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {UserCard} from "../components/ExploreComponents/UserCard.jsx";


export const Explore = () => {


    const [searchQuery, setSearchQuery] = useState('');
    const [searchHasFocus, setSearchHasFocus] = useState(false);
    const [userCards, setUserCards] = useState([]);

    const {API_URL, user} = useAuth();


    useEffect(() => {

        const delayBouncing = setTimeout(() => {

            if (searchQuery.trim().length > 0) {
                fetch(`${API_URL}/explore/search/${user.id}?q=${searchQuery}`)
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        setUserCards(data);
                    })
                    .catch(err => console.log(err));
            } else {
                setUserCards([]);
            }

        }, 300)

        return () => clearTimeout(delayBouncing);

    }, [searchQuery]);



    return (
        <main className="explore">

            <div
                style={{
                    zIndex: 9999,
                }}
                className="explore-searchcontainer">

                <Inputfield
                type='text'
                name='searchText'
                id='searchText'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                example={'Find other users'}
                onFocus={() => setSearchHasFocus(true)}
                onBlur={() => setSearchHasFocus(false)}

                svg={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>}/>

                {userCards.length > 0 && (
                    (userCards.map((user) => (
                        <UserCard
                            username={user.username}
                            avatar={user.avatar}
                            inputFocus={searchHasFocus}
                            id={user.id}
                        />
                    )))
                )}

            </div>


            <ExploreImageGrid/>

            <NavigationBar
                searchHasFocus={searchHasFocus}
            />

            <Overlay showOverlay={searchHasFocus} />

        </main>
    )
}