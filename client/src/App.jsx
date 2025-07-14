import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Start } from "./pages/Start.jsx";
import { Feed } from "./pages/Feed.jsx";
import { Profile } from "./pages/Profile.jsx";
import { NewPost } from "./pages/NewPost.jsx";
import { ResetPassword } from "./pages/ResetPassword.jsx";
import { InspectPost } from "./components/ProfileComponents/InspectPost.jsx";
import { CommentSection } from "./pages/CommentSection.jsx";
import { Notifications } from "./pages/Notifications.jsx";
import { Explore } from "./pages/Explore.jsx";
import { Conversation } from "./pages/Conversation.jsx";
import { DirectMessages } from "./pages/DirectMessages.jsx";
import { Toaster } from 'react-hot-toast';

import { ChatProvider } from "./context/ConversationContext.jsx";
import ProtectedRoute from "./context/ProtectedRoute.jsx";
import {NotFound} from "./pages/NotFound.jsx";


/**
 * Oskar, fixa alla i en protected route, och lägg en default "Hmm.. are that file does not exist "
 *
 * @returns {JSX.Element}
 * @constructor
 */


function App() {
    const PRODUCTION_URL = import.meta.env.VITE_API_BASE_URL;
    const API_BASE_URL = import.meta.env.PROD ? PRODUCTION_URL : "/api";

    return (
        <div className="App">
            <Routes>

                {/* Public routes */}
                <Route path="/" element={<Start />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/reset" element={<ResetPassword />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/new/post" element={<NewPost />} />
                    <Route path="/:username/:postid" element={<InspectPost />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/:username" element={<Profile />} />
                    <Route path="/:username/:postid/comments" element={<CommentSection />} />
                    <Route
                        path="/messages"
                        element={
                            <ChatProvider>
                                <DirectMessages />
                            </ChatProvider>
                        }
                    />
                    <Route
                        path="/messages/:conversationId"
                        element={
                            <ChatProvider>
                                <Conversation />
                            </ChatProvider>
                        }
                    />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
            </Routes>

            <Toaster position="bottom-center" />
        </div>
    );
}

export default App;
