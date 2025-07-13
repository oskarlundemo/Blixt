import {useNavigate} from "react-router-dom";
import {LoadingTitle} from "../LoadingTitle.jsx";

/**
 * This component is used for displaying and wrapping all the images that are shown
 * in the Explore.jsx page
 *
 * @param posts all the posts that are shown
 * @param loading state
 * @returns {JSX.Element}
 * @constructor
 */


export const ExploreImageGrid = ({posts, loading}) => {

    const navigate = useNavigate(); // Use this hook for navigation

    return (
        <section className="explore-image-grid">
            {loading
                ? (
                    <LoadingTitle/>
                ) : (
                    (posts.length >  0 ? (
                        (posts.map(post => (
                            <article
                                key={post.id}>
                                <img
                                    src={post.images[0].url}
                                    alt={post.title}
                                    style={{ width: '100%', height: '100%'}}
                                    draggable={false}

                                    onClick={() => navigate(`/${post.poster.username}/${post.id}`)}
                                />
                            </article>
                        )))
                    ) : (
                        <p style={{ gridColumn: 'span 3', textAlign: 'center' }}>No posts could be found</p>
                    ))
                )
            }
        </section>
    )
}