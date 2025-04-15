import { Routes, Route } from 'react-router-dom';
import Landing from './components/Landing/Landing';
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import Pricing from './components/Pricing/Pricing';

function App() {
  return (

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/pricing" element={<Pricing />} />
        
        {/* Ruta pentru 404 - Pagină inexistentă */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>

  );
}

export default App;