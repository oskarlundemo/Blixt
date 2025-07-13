import {useEffect, useState} from "react";
import '../App.css'
import {useAuth} from "../context/AuthContext.jsx";


/**
 * This component is a menu that slides in from the bottom in the Post.jsx,
 * giving the user functionality to delete a post, archive or make it public.
 *
 *
 * @param showBottomMenu state to show the menu
 * @param setShowBottomMenu set the state
 * @param archived check if the post is archived or public
 * @param setPosts state to update the posts
 * @param postID id of the post
 * @returns {JSX.Element}
 * @constructor
 */



export const BottomMenu = ({showBottomMenu, setShowBottomMenu, archived, setPosts, postID = 0}) => {

    const {API_URL, token} = useAuth();
    const [isPublic, setIsPublic] = useState(archived);  // State to check if the post is accessible to the public

    // This hook updates and checks if the post is public or not
    useEffect(() => {
        setIsPublic(archived);
    }, [archived]);

    // This function handles the delete request of a post
    const deletePostHandler = async (postID) => {
        try {
            setShowBottomMenu(false);
            await fetch(`${API_URL}/posts/delete/${postID}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (err) {
            console.log('Error while deleting post', err.code);
        }
    }


    const archivePostHandler = async (postID) => {
        try {
            setShowBottomMenu(false);
            await fetch(`${API_URL}/posts/archive/${postID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    setIsPublic(data.isPublic);
                })
                .catch(err => console.log(err));

        } catch (err) {
            console.log('Error while archiving post', postID);
        }
    }

    return (
        <div
            className={`bottom-menu ${showBottomMenu ? "active" : ""}`}>

            <svg
                style={{
                    alignSelf: "flex-end",
                    cursor: "pointer",
                    margin: '0.5rem'
                }}

                className={'close-icon'}

                onClick={() => setShowBottomMenu(false)}
                xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>


            {isPublic ? (
                <div
                    className={`bottom-menu-archive-box`}

                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "90%",
                    }}>
                    <h2>Make public</h2>

                    <svg
                        onClick={() => archivePostHandler(postID)}
                        xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q41-45 62.5-100.5T800-480q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z"/></svg>
                   </div>
            ) : (
                <div
                    className={`bottom-menu-archive-box`}

                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "90%",
                    }}>
                    <h2>Archive post</h2>
                    <svg
                        onClick={() => {archivePostHandler(postID)
                            setPosts(p => p.filter(post => post.id !== postID))
                        }}
                        xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-80q-33 0-56.5-23.5T120-160v-451q-18-11-29-28.5T80-680v-120q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v120q0 23-11 40.5T840-611v451q0 33-23.5 56.5T760-80H200Zm0-520v440h560v-440H200Zm-40-80h640v-120H160v120Zm200 280h240v-80H360v80Zm120 20Z"/></svg>
                </div>
            )}

            <div
                className={`bottom-menu-delete-box`}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "90%",
                }}
            >
                <h2>Delete post</h2>
                <svg
                    onClick={() => deletePostHandler(postID)}
                    xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </div>

        </div>
    )
}