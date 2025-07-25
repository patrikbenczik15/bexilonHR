import AppTheme from "../../theme/AppTheme";
import { CssBaseline } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";

const items = [
  {
    icon: <SettingsSuggestRoundedIcon />,
    title: "Dynamic Workflow",
    description:
      "Configure document flows on the fly to match your team’s evolving HR processes.",
  },
  {
    icon: <ConstructionRoundedIcon />,
    title: "Robust Security",
    description:
      "Keep sensitive employee files safe with enterprise-grade encryption and access controls.",
  },
  {
    icon: <ThumbUpAltRoundedIcon />,
    title: "Seamless Collaboration",
    description:
      "Share, comment, and approve documents together in real time without leaving the platform.",
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: "Smart Notifications",
    description:
      "Receive automatic reminders and alerts for pending approvals and upcoming expirations.",
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: "Dedicated Support",
    description:
      "Our HR specialists and tech team are here to help you get the most out of BexilonHR.",
  },
  {
    icon: <QueryStatsRoundedIcon />,
    title: "Actionable Insights",
    description:
      "Analyze completion rates, bottlenecks, and compliance metrics with intuitive dashboards.",
  },
];

export default function Highlights(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box
        id="highlights"
        sx={{
          pt: { xs: 4, sm: 12 },
          pb: { xs: 8, sm: 16 },
          color: "white",
          bgcolor: "grey.900",
        }}
      >
        <Container
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: { xs: 3, sm: 6 },
          }}
        >
          <Box
            sx={{
              width: { sm: "100%", md: "60%" },
              textAlign: { sm: "left", md: "center" },
            }}
          >
            <Typography component="h2" variant="h4" gutterBottom>
              Highlights
            </Typography>
            <Typography variant="body1" sx={{ color: "grey.400" }}>
              Discover how BexilonHR transforms your HR operations with flexible
              workflows, iron-clad security, and insights that empower better
              decisions.
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {items.map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Stack
                  direction="column"
                  component={Card}
                  spacing={1}
                  useFlexGap
                  sx={{
                    color: "inherit",
                    p: 3,
                    height: "100%",
                    borderColor: "hsla(220, 25%, 25%, 0.3)",
                    backgroundColor: "grey.800",
                  }}
                >
                  <Box sx={{ opacity: "50%" }}>{item.icon}</Box>
                  <div>
                    <Typography gutterBottom sx={{ fontWeight: "medium" }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "grey.400" }}>
                      {item.description}
                    </Typography>
                  </div>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </AppTheme>
  );
}
