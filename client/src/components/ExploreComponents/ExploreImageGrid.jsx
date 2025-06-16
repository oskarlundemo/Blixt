import {LoadingBox} from "../LoadingBox.jsx";
import {useNavigate} from "react-router-dom";


export const ExploreImageGrid = ({posts, loading}) => {

    const navigate = useNavigate();

    return (
        <section className="explore-image-grid">
            {loading
                ? Array(9).fill(0).map((_, i) => <LoadingBox key={i} />)
                : posts.length > 0
                    ? posts.map(post => (
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

                    ))
                    : <p style={{ gridColumn: 'span 3', textAlign: 'center' }}>No posts could be found</p>
            }
        </section>
    )



}