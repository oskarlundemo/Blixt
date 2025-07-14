import { useNavigate } from "react-router-dom";

export const PostGrid = ({ posts, emptyMessage }) => {
    const navigate = useNavigate();

    return (
        posts.length > 0 ? (
            posts.map(post => (
                <article
                    key={post.id}
                    onClick={() => navigate(`/${post.poster.username}/${post.id}`)}
                >
                    {post.images[0] ? (
                        <img
                            draggable={false}
                            src={post.images[0].url}
                            alt={`Post ${post.id}`}
                        />
                    ) : (
                        <p>No image available</p>
                    )}
                </article>
            ))
        ) : (
            <p className="empty-post-message">{emptyMessage}</p>
        )
    );
};