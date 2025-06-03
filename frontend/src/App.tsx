import { Routes, Route } from "react-router-dom";
import Landing from "./components/Landing/Landing";
import SignUp from "./components/SignUp/SignUp";
import SignIn from "./components/SignIn/SignIn";
import NotFound from "./components/NotFound/NotFound";
import Demo from "./components/Demo/Demo";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
