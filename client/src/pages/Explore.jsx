

import '../styles/Explore.css'
import {NavigationBar} from "../components/NavigationBar.jsx";
import {useEffect, useState} from "react";
import {Inputfield} from "../components/InputField.jsx";
import {ExploreImageGrid} from "../components/ExploreComponents/ExploreImageGrid.jsx";
import {Overlay} from "../components/Overlay.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {UserCard} from "../components/ExploreComponents/UserCard.jsx";
import {HeaderMenu} from "../components/HeaderMenu.jsx";
import {LoadingTitle} from "../components/LoadingTitle.jsx";


export const Explore = () => {


    const [searchQuery, setSearchQuery] = useState('');
    const [searchHasFocus, setSearchHasFocus] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const {API_URL, user, token} = useAuth();


    useEffect(() => {
        const delayBouncing = setTimeout(() => {

            if (searchQuery.trim().length > 0) {
                fetch(`${API_URL}/explore/search/?q=${searchQuery}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        setSearchResults(data);
                    })
                    .catch(err => console.log(err));
            } else {
                setSearchResults([]);
            }
        }, 300)

        return () => clearTimeout(delayBouncing);

    }, [searchQuery]);


    useEffect(() => {

        fetch(`${API_URL}/explore/load/posts`, {
            method: "GET",
            headers: {
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
        <main className="explore">


            <HeaderMenu/>

            {loading ? (
                <LoadingTitle/>
            ): (
                <>
                    <div
                        style={{
                            zIndex: 9999,
                        }}
                        className="explore-search-container">

                        <Inputfield
                            type='text'
                            name='searchText'
                            id='searchText'
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            example={'Find other users'}
                            onFocus={() => setSearchHasFocus(true)}
                            onBlur={() => setTimeout(() => setSearchHasFocus(false), 100)}

                            svg={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>}/>

                        {searchResults.length > 0 && searchHasFocus && (
                            <div className="explore-results">
                                {searchResults.map((user) => (
                                    <UserCard
                                        key={user.id}
                                        username={user.username}
                                        avatar={user.avatar}
                                        inputFocus={searchHasFocus}
                                        id={user.id}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <ExploreImageGrid
                        loading={loading}
                        posts={posts}
                    />
                </>
            )}


            <NavigationBar
                searchHasFocus={searchHasFocus}
            />

            <Overlay showOverlay={searchHasFocus} />

        </main>
    )
}