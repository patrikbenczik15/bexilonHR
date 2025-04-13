import NavBar from "../NavBar";
import SignInCard from "./SignInCard";
import SignInSideInfo from "./SignInSideInfo";
import Stack from '@mui/material/Stack';

export default function SignInSide() {
    return (
        <>
        <NavBar/>
        <Stack
          direction="column"
          component="main"
          sx={[
            {
              justifyContent: 'center',
              height: 'calc((1 - var(--template-frame-height, 0)) * 100%)',
              marginTop: '0',
              minHeight: '100%',
              background: 'linear-gradient(to left,rgb(16, 24, 43), #0f172a)'
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
        </>
    );
  }
  