import {Routes, Route} from 'react-router-dom';
import './App.css'
import {Start} from "./pages/Start.jsx";
import {Feed} from "./pages/Feed.jsx";
import {Profile} from "./pages/Profile.jsx";
import {NewPost} from "./pages/NewPost.jsx";
import {ResetPassword} from "./pages/ResetPassword.jsx";
import {InspectPost} from "./components/ProfileComponents/InspectPost.jsx";
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
                path="/reset-password"
                element={
                    <ResetPassword/>
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
                path="/profile/:uuid"
                element={
                <Profile/>
                }
            />


            <Route
              path="*"
              element={
                <Start/>
              }
            />

        </Routes>
      </div>
  )
}

export default App