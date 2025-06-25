import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout"
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail"
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<DefaultLayout />} >
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventDetail />} />

        </Route>
      </Routes>
    </Router>
  )
}

export default App
