import {NavigationBar} from "../components/NavigationBar.jsx";
import '../styles/Notifications.css'
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {NotificationCard} from "../components/NotificationsComponents/NotificationCards.jsx";
import {LoadingTitle} from "../components/LoadingTitle.jsx";
import {HeaderMenu} from "../components/HeaderMenu.jsx";
import {ErrorMessage} from "../components/ErrorMessage.jsx";


/**
 * This page / component is rendered when a user wants to check
 * their notifications
 *
 * @returns {JSX.Element}
 * @constructor
 */

export const Notifications = () => {

    const [notifications, setNotifications] = useState([]); // State to hold the notifications
    const [renderIndex, setRenderIndex] = useState(10); // State to render 10 notifications at a time
    const [loading, setLoading] = useState(true); // State to set loading
    const [error, setError] = useState(false);
    const {API_URL, token} = useAuth();

    // This hook runs on mount and fetches the notifications of the user
    useEffect(() => {
        fetch(`${API_URL}/notifications/load`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                setNotifications(data);
                setLoading(false);}
            )
            .catch(err => {
                setLoading(false);
                setError(true);
                console.log(err)
            });

    }, [])

    return (
        <main
            className={'notifications-wrapper'}>

            {!error && (
                <HeaderMenu/>
            )}

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}
                className={'notifications-section'}>

                {error ? (
                    <ErrorMessage
                        message={'There was an error loading your notifications'}
                        svg={
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-200v-80h80v-280q0-33 8.5-65t25.5-61l60 60q-7 16-10.5 32.5T320-560v280h248L56-792l56-56 736 736-56 56-146-144H160Zm560-154-80-80v-126q0-66-47-113t-113-47q-26 0-50 8t-44 24l-58-58q20-16 43-28t49-18v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v206Zm-276-50Zm36 324q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Zm33-481Z"/></svg>
                        }
                    />
                ) : (
                    (loading ? (
                        <LoadingTitle />
                    ) : (
                        <>
                            {notifications.length > 0 ? (
                                notifications.slice(0, renderIndex).map((notification) => (
                                    <NotificationCard
                                        key={notification.id}
                                        action={notification.type}
                                        user={notification.notifier}
                                        timestamp={notification.createdAt}
                                        thumbnail={notification.post?.images[0].url}
                                        post={notification.post}
                                    />
                                ))
                            ) : (
                                <ErrorMessage
                                    message={'No notifications found.'}
                                    svg={
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/></svg>
                                    }/>
                            )}
                            {renderIndex < notifications.length && (
                                <button
                                    style={{
                                        width: 'fit-content',
                                        alignSelf: 'center',
                                        margin: '1rem auto',
                                        display: 'block',
                                    }}
                                    onClick={() => setRenderIndex(renderIndex + 10)}
                                >
                                    Load more
                                </button>
                            )}
                        </>
                    ))
                )}
            </section>

            <NavigationBar/>

        </main>
    )



}