import {Routes, Route} from 'react-router-dom';
import './App.css'
import {Start} from "./pages/Start.jsx";
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
                <Start API_URL={API_BASE_URL}/>
              }
          />

          <Route
              path="*"
              element={
                <Start API_URL={API_BASE_URL} />
              }
          />

        </Routes>
      </div>
  )
}

export default App