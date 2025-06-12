import {useState} from "react";


import '../App.css'
import {useAuth} from "../context/AuthContext.jsx";

export const BottomMenu = ({showBottomMenu, setShowBottomMenu, postID = 0}) => {


    const {API_URL, token} = useAuth();


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
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-80q-33 0-56.5-23.5T120-160v-451q-18-11-29-28.5T80-680v-120q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v120q0 23-11 40.5T840-611v451q0 33-23.5 56.5T760-80H200Zm0-520v440h560v-440H200Zm-40-80h640v-120H160v120Zm200 280h240v-80H360v80Zm120 20Z"/></svg>
            </div>

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