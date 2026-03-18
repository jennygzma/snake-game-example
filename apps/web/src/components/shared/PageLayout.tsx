import type { PropsWithChildren } from "react";
import type { ContainerProps } from "@mui/material";
import { Container, Stack, type SxProps, type Theme } from "@mui/material";

type PageLayoutProps = PropsWithChildren<{
  maxWidth?: ContainerProps["maxWidth"];
  spacing?: number;
  py?: number;
  containerSx?: SxProps<Theme>;
  stackSx?: SxProps<Theme>;
}>;

export const PageLayout = ({
  children,
  maxWidth = "lg",
  spacing = 3,
  py = 4,
  containerSx,
  stackSx
}: PageLayoutProps) => {
  return (
    <Container maxWidth={maxWidth} sx={[{ py }, ...(Array.isArray(containerSx) ? containerSx : containerSx ? [containerSx] : [])]}>
      <Stack spacing={spacing} sx={stackSx}>
        {children}
      </Stack>
    </Container>
  );
};
