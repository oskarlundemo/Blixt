

export const likePost = async (API_URL, postID, userID) => {

    try {
        const response = await fetch(`${API_URL}/posts/like/${postID}/${userID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            console.error("HTTP error", response.status, response.statusText);
        } else {
            console.log('Like Post');
        }

    } catch (err) {
        console.error("Network or fetch error:", err);
    }
}