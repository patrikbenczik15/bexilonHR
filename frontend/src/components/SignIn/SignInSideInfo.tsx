import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DocumentScannerRoundedIcon from "@mui/icons-material/DocumentScannerRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";

const items = [
  {
    icon: <DocumentScannerRoundedIcon sx={{ color: "text.primary" }} />,
    title: "Automated HR Document Handling",
    description:
      "Eliminate manual effort. Let Bexilon validate, process, and route employee documents with smart automation.",
  },
  {
    icon: <TuneRoundedIcon sx={{ color: "text.primary" }} />,
    title: "Customizable Workflows",
    description:
      "You decide what document types are allowed, required, or must contain signatures — fully adjustable by HR admins.",
  },
  {
    icon: <CheckCircleRoundedIcon sx={{ color: "text.primary" }} />,
    title: "AI-Powered Validation",
    description:
      "Each upload is scanned by our AI to detect missing data, invalid formats, or missing signatures — before it reaches HR.",
  },
  {
    icon: <GroupsRoundedIcon sx={{ color: "text.primary" }} />,
    title: "Smart Role-Based Access",
    description:
      "Employees, HR, and directors all see exactly what they need. Role-based views keep your operations efficient and secure.",
  },
];

export default function Content() {
  return (
    <Stack
      sx={{
        flexDirection: "column",
        alignSelf: "center",
        gap: 4,
        maxWidth: 450,
      }}
    >
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <Typography variant="h2" sx={{ color: "primary.text" }}>
          bexilon
        </Typography>
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: "medium" }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
