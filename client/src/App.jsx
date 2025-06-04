import {Routes, Route} from 'react-router-dom';
import './App.css'
import {Start} from "./pages/Start.jsx";
import ProtectedRoute from "./context/ProtectedRoute.jsx";
import {Feed} from "./pages/Feed.jsx";
import {Profile} from "./pages/Profile.jsx";
import {NewPost} from "./pages/NewPost.jsx";
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
                path="/profile"
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