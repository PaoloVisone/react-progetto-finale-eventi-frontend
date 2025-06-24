import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout"
import Home from "./pages/Home";
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<DefaultLayout />} >
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
