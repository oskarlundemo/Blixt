import {Routes, Route} from 'react-router-dom';
import './App.css'
import {Start} from "./pages/Start.jsx";
import ProtectedRoute from "./context/ProtectedRoute.jsx";
import {Feed} from "./pages/Feed.jsx";
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