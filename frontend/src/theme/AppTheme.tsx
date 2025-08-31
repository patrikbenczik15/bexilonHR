import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import { inputsCustomizations } from "./customizations/inputs";
import { dataDisplayCustomizations } from "./customizations/DataDisplay";
import { feedbackCustomizations } from "./customizations/feedback";
import { navigationCustomizations } from "./customizations/navigation";
import { surfacesCustomizations } from "./customizations/surfaces";
import { palette, typography, shadows, shape } from "./themePrimitives";
import CssBaseline from "@mui/material/CssBaseline";

interface AppThemeProps {
  children: React.ReactNode;
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];
}

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents } = props;
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          palette,
          typography,
          shadows,
          shape,
          components: {
            ...inputsCustomizations,
            ...dataDisplayCustomizations,
            ...feedbackCustomizations,
            ...navigationCustomizations,
            ...surfacesCustomizations,
            ...themeComponents,
          },
        });
  }, [disableCustomTheme, themeComponents]);

  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
