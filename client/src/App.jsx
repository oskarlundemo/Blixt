import {Routes, Route} from 'react-router-dom';
import './App.css'
import {Start} from "./pages/Start.jsx";
import {Feed} from "./pages/Feed.jsx";
import {Profile} from "./pages/Profile.jsx";
import {NewPost} from "./pages/NewPost.jsx";
import {ResetPassword} from "./pages/ResetPassword.jsx";
import {InspectPost} from "./components/ProfileComponents/InspectPost.jsx";
import {CommentSection} from "./pages/CommentSection.jsx";
import {Notifications} from "./pages/Notifications.jsx";
import {Explore} from "./pages/Explore.jsx";
import {Conversation} from "./pages/Conversation.jsx";
import {DirectMessages} from "./pages/DirectMessages.jsx";
import {CreateChat} from "./pages/CreateChat.jsx";
import {ToastContainer} from "react-toastify";
import {ChatProvider} from "./context/GroupChatContext.jsx";
function App() {

  const PRODUCTION_URL = import.meta.env.VITE_API_BASE_URL;
  const API_BASE_URL = import.meta.env.PROD
      ? PRODUCTION_URL
      : "/api";


  return (
      <div className="App">
        <Routes>

             <Route
              path="/"
              element={
                <Start/>
              }
             />

            <Route
                path="/new/post"
                element={
                    <NewPost/>
                }
            />

            <Route
                path="/:username/:postid"
                element={
                    <InspectPost/>
                }
            />


            <Route
                path="/:username/:postid/comments"
                element={
                    <CommentSection/>
                }
            />


            <Route
                path="/explore"
                element={
                    <Explore/>
                }
            />

            <Route
                path="/reset-password"
                element={
                    <ResetPassword/>
                }
            />

            <Route
                path="/notifications"
                element={
                    <Notifications/>
                }
            />


            <Route
                path="/feed"
                element={

                <Feed/>

                    /**
                     *
                     *                     <ProtectedRoute>
                     *
                     *                     </ProtectedRoute>
                     */

                }/>

            <Route
                path="/:username"
                element={
                <Profile/>
                }
            />


            <Route
                path="/messages"
                element={
                    <DirectMessages/>
                }
            />


            <Route
                path="/messages/:username"
                element={
                    <ChatProvider>
                        <Conversation />
                    </ChatProvider>
                }
            />

            <Route
                path="/messages/group/:group_id"
                element={
                    <ChatProvider>
                        <Conversation />
                    </ChatProvider>
                }
            />

            <Route path='/messages/new'
                   element={<CreateChat/>}
            />

            <Route
              path="*"
              element={
                <Start/>
              }
            />

        </Routes>

          <ToastContainer position="bottom-right" autoClose={3000} />

      </div>
  )
}

export default App