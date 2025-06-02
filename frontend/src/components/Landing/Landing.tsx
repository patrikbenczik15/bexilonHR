import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "../../theme/AppTheme";
import NavBar from "../NavBar/NavBar";
import Hero from "./Hero";
import { Box } from "@mui/material";
import Features from "./Features";
import Testimonials from "./Testimonials";
import Highlights from "./Highlights";
import Pricing from "./Pricing";
import FAQ from "./FAQ";
import Footer from "../Footer/Footer";

const sections = [
  { id: "features", component: <Features /> },
  { id: "testimonials", component: <Testimonials /> },
  { id: "highlights", component: <Highlights /> },
  { id: "pricing", component: <Pricing /> },
  { id: "faq", component: <FAQ /> },
  { id: "footer", component: <Footer /> },
];

const isLoggedIn = () => !!localStorage.getItem("token");

// TODO margin prea mari
export default function Landing(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <NavBar />

      <Box component="main">
        <Hero />
        {sections.map(({ id, component }) => (
          <Box id={id} key={id} component="section">
            {component}
          </Box>
        ))}
      </Box>
    </AppTheme>
  );
}
