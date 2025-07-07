// Import dei moduli React Router per la gestione delle rotte
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import dei layout e delle pagine principali dell'applicazione
import DefaultLayout from "./layouts/DefaultLayout"
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail"
import Eventi from "./pages/Eventi"
import ContactsForm from "./pages/ContactsForm"
import Booking from "./pages/Booking"

// Import del file CSS principale dell'app
import './App.css'

function App() {
  return (
    // Router principale che gestisce la navigazione
    <Router>
      <Routes>
        {/* Tutte le rotte sono racchiuse dal layout di default */}
        <Route element={<DefaultLayout />} >
          {/* Rotta per la home page */}
          <Route path="/" element={<Home />} />
          {/* Rotta per la lista degli eventi */}
          <Route path="/events" element={<Eventi />} />
          {/* Rotta per il dettaglio di un evento specifico */}
          <Route path="/events/:id" element={<EventDetail />} />
          {/* Rotta per la prenotazione di un evento specifico */}
          <Route path="/events/:id/bookings" element={<Booking />} />
          {/* Rotta per la pagina dei contatti */}
          <Route path="/contacts" element={<ContactsForm />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
