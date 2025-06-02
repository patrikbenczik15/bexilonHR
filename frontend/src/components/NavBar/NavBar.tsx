import AuthBar from "./AuthBar";
import LandingBar from "./LandingBar";

export default function NavBar() {
  return location.pathname === "/" ? <LandingBar /> : <AuthBar />;
}
