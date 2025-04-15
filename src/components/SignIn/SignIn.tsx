// TODO RESPONSIVE DESIGN

import AppAppBar from "../Landing/AppAppBar";
import SignInCard from "./SignInCard";
import SignInSideInfo from "./SignInSideInfo";
import Stack from '@mui/material/Stack';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../theme/AppTheme';
import Footer from "../Footer";
import { styled } from '@mui/material/styles';
const SignInContainer = styled(Stack)(({ theme }) => ({
  position: 'relative',
  minHeight: 'calc(100vh - 60px)', 
  padding: theme.spacing(2),
  paddingTop: theme.spacing(8), 
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
    paddingTop: theme.spacing(12),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    background: 'linear-gradient(to left,rgb(16, 24, 43), #0f172a)',
  },
}));

export default function SignInSide() {
    return (
        <AppTheme >
        <CssBaseline enableColorScheme/>
        <AppAppBar/>
        <SignInContainer direction="column" justifyContent="space-between">
        <Stack
          direction="column"
          component="main"
          sx={[
            {
              justifyContent: 'center',
              height: '100vh',
              marginTop: '-3.125rem',
              minHeight: '100%',
              background: 'linear-gradient(to left,rgb(16, 24, 43), #0f172a)',
            //     '&::-webkit-scrollbar': { display: 'none' }, '&::-moz-scrollbar': { display: 'none' }, '&::-ms-scrollbar': { display: 'none' }
            // Test ^^^^^^^ design later.
             },
          ]}
        >
          <Stack
            direction={{ xs: 'column-reverse', md: 'row' }}
            sx={{
              justifyContent: 'center',
              gap: { xs: 6, sm: 12 },
              p: 2,
              mx: 'auto',
            }}
          >
            <Stack
              direction={{ xs: 'column-reverse', md: 'row' }}
              sx={{
                justifyContent: 'center',
                gap: { xs: 6, sm: 12 },
                p: { xs: 2, sm: 4 },
                m: 'auto',
              }}
            >
              <SignInSideInfo />
              <SignInCard />
            </Stack>
          </Stack>
        </Stack>
        </SignInContainer>
        <Footer />
        </AppTheme>
    );
  }
  