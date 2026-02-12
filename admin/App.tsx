import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { LandingPage } from './landing-page';
import { CustomerPage } from './consumer-page';
import { ManufacturerPage } from './manufacturer-dashboard';
import { AdminPage } from './admin-dashboard';
import { SellerPage } from './seller-dashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/manufacturer" element={<ManufacturerPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/seller" element={<SellerPage />} />
      </Routes>
    </Router>
  );
}
