

import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {LoadingTitle} from "../LoadingTitle.jsx";
import {useParams} from "react-router-dom";


/**
 * This component is used for showing the Gif container where users
 * can send gifs to each other
 *
 *
 * @param showGifs  // State to toggle the pop-up window
 * @param setShowGifs // Set the state to toggle the pop-up window
 * @param setReceivers // Set the recipients of the message
 * @param receivers   // Recipients of a new message
 * @returns {JSX.Element}
 * @constructor
 */




export const GifContainer = ({ showGifs, setShowGifs}) => {


    const {token, API_URL} = useAuth();
    const [gifs, setGifs] = useState([]);  // Array to hold the gifs
    const [gifSearch, setGifSearch] = useState("");  // Search string for gifs
    const [loading, setLoading] = useState(false);  // Set loading state for gifs
    const {username, group_id} = useParams();

    const apiKey = import.meta.env.VITE_GIPHY_KEY;  // Get API key from .env
    const limit = 9;  // Limit the gifs to 10

    // This hook is triggered on mount, popularising the gif array with some trending gifs
    useEffect( () => {

        // Set array of gifs to trending
        const setTrendingGifs = async () => {
            // Set loading of gifs
            setLoading(true);
            try {
                const response = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=${limit}`); // Fetch from GiphyAPI
                const data = await response.json();
                setGifs(data.data); // Set the array with the data
                setLoading(false); // Set loading false
            } catch (err) {
                console.log(err); // If error log it
                setLoading(false); // Also set false
            }
        }
        setTrendingGifs();  // Call on mount
    }, [])


    // This function is used for fetching new gifs the user hits enter
    const fetchGifs = async (query) => {
        try {
            setLoading(true); // Set to loading
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=${limit}`); // Fetch grom GiphyAPI
            const data = await response.json();
            setGifs(data.data); // Set array with new gifs
            setLoading(false); // Set loading to false
        } catch (error) {
            console.error("Failed to fetch gifs", error);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (gifSearch.trim()) fetchGifs(gifSearch);
    };


    const sendGif = async (gif) => {
        setShowGifs(false);

        const endPoint = username ? 'private' : 'group';
        const params = username ? encodeURIComponent(username) : group_id;

        const sanitizedGif = {
            id: gif.id,
            url: gif.images?.original?.url,
            title: gif.title || ""
        };

        try {
            const res = await fetch(`${API_URL}/messages/send/gif/${endPoint}/${params}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ gif: sanitizedGif })
            });

            if (!res.ok) {
                console.error("GIF send failed:", await res.text());
                // Optionally notify user
            }
        } catch (err) {
            console.error("Message send error:", err);
            // Optionally notify user
        }
    }


    return (

        <div className={`gifContainer-wrapper ${showGifs ? 'show' : ''}`}>
            {/* Toggle the GIF container based on state */}

            <div className="gifContainer-search">
                <form onSubmit={handleSubmit}>

                    <input
                        type='text'
                        value={gifSearch}
                        onChange={e => setGifSearch(e.target.value)}
                        placeholder='Send something funny...'
                    />
                </form>

              </div>

            <div className="gifContainer-search-result">

                {/* If the gifs are loading, show loading animation */}
                {loading ? (
                    <LoadingTitle/>
                ) : (
                    // For each GIF, print and show
                    (gifs.length > 0 ? (
                        gifs.map((gif, index) => (
                            <img
                                onClick={() => sendGif(gif)}
                                key={index}
                                src={gif.images.fixed_height.url}
                                alt={gif.title}
                            />
                        ))
                    ) : (
                        <p
                            style={{
                                textAlign: "center",
                                gridArea: '1 / 2 / 2 / 2'
                            }}
                        >No gifs found</p>
                    ))
                )}
            </div>
        </div>
    )
}