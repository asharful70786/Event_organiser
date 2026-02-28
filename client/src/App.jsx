import './App.css';
import { Routes , Route } from 'react-router-dom';

import BookingForm from "./components/BookingForm";
import AdminPage from './pages/admin/AdminPage';
import HealthCheck from './components/HealthCheck';

function App() {
  return (
    <>
    <HealthCheck />
    <Routes>
      <Route path="/" element={<BookingForm />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
    </>
  );
}

export default App;