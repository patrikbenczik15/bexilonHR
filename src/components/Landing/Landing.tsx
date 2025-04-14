import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../../theme/AppTheme';
import AppAppBar from './AppAppBar';
import Hero from './Hero';
import LogoCollection from './LogoCollection';
import Highlights from './Highlights';
import NavBar from '../NavBar';
import Features from './Features';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import Footer from '../Footer';
export default function MarketingPage(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      {/* <NavBar /> */}
      <AppAppBar />
      <Hero />
      <div>
        <LogoCollection />
        <Features />
        <Divider />
        <Testimonials />
        <Divider />
        <Highlights />
        <Divider />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}