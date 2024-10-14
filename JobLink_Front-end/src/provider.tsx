import { NextUIProvider } from "@nextui-org/system";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}
export function Provider({ children, themeProps }: ProvidersProps) {
  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate}>
      <ThemeProvider defaultTheme="system" attribute="class" {...themeProps}>
        {children}
      </ThemeProvider>
    </NextUIProvider>
  );
}
