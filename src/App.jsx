import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Layouts
import DefaultLayout from "./layouts/DefaultLayout"
// Pages
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail"
import Eventi from "./pages/Eventi"
// Css
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<DefaultLayout />} >
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/eventi" element={<Eventi />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
