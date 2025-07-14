import {useEffect, useRef, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import '../styles/Profile.css'


/**
 * This component is used to render the avatars of all
 * the users on the plattform
 *
 * @param user object
 * @param setEdit state to set edit
 * @param setFile set that selected file
 * @param file reference to a new file
 * @param size of the avatar
 * @param selectPicture true or false, if they user can select a new picture or not
 * @returns {JSX.Element}
 * @constructor
 */

export const UserAvatar = ({ user, setEdit = false, autoSize = false, setFile, file, size = '25px', selectPicture }) => {

    const [userAvatar, setUserAvatar] = useState(''); // State to hold the src of the avatar
    const [loadingAvatar, setLoadingAvatar] = useState(true); // State for loading the avatar
    const {user: loggedInUser} = useAuth(); // Get user from context

    // This hook runs on mount
    useEffect(() => {
        if (user?.avatar) {
            setUserAvatar(user.avatar);
            setLoadingAvatar(false);
        } else { // If the users avatar is null, then set it to default
            setUserAvatar('/default.jpg');
            setLoadingAvatar(false);
        }
    }, [user]);


    const fileInputRef = useRef(null);

    // This function handels the selection of the files
    const handleButtonClick = () => {
        fileInputRef.current.click();
        setEdit(true);
    };

    // This function sets the states of the files and display the selected one
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            const previewUrl = URL.createObjectURL(selectedFile);
            setUserAvatar(previewUrl);
            setFile(selectedFile);
        }
    };

    const finalSize = autoSize || size;

    return (
        <>
            {user?.id === loggedInUser?.id && selectPicture ? (
                /* With select picture == true, users can click on their avatar and change the picture */
                <div className="user-avatar-select-picture"
                     style={{
                         backgroundImage: `url(${file || user?.avatar || '/default.jpg'})`,
                         height: finalSize,
                         width: finalSize,
                     }}
                >

                    <div className="user-avatar-select-box">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{
                                display: 'none',
                            }}
                        />

                        <button
                            onClick={handleButtonClick}
                        />

                    </div>

                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg>

                </div>
            ) : (
                (loadingAvatar ? (
                    <div style={{height: finalSize, width: finalSize}} className="loading-avatar"></div>
                ) : (
                    <div
                        style={{
                            backgroundImage: `url(${file || user?.avatar || '/default.jpg'})`,
                            height: finalSize,
                            width: finalSize,
                        }}

                        className="user-avatar-select-picture-default">
                    <img
                        key={Date.now()}
                        className="user-avatar-select-picture-default"
                        src={userAvatar || '/default.jpg'}
                        alt="user-avatar"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: "contain",
                            objectPosition: "center",
                            borderRadius: "50%",
                        }}
                        draggable={false}/>
                    </div>
                ))
            )}
        </>
    );
};