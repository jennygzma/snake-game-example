import { useEffect, useRef, type PropsWithChildren } from "react";
import { Backdrop, Box, Fade, useMediaQuery, useTheme } from "@mui/material";
import { Panel } from "./Panel";

type ModalShellProps = PropsWithChildren<{
  open: boolean;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}>;

export const ModalShell = ({ open, ariaLabelledBy, ariaDescribedBy, children }: ModalShellProps) => {
  const theme = useTheme();
  const shouldReduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    const focusables = dialogElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusables[0] ?? dialogElement;
    firstFocusable.focus();
  }, [open]);

  useEffect(() => {
    if (open) return;

    const lastFocused = lastFocusedRef.current;
    if (lastFocused) {
      lastFocused.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const dialogElement = dialogRef.current;
      if (!dialogElement) return;

      const focusables = Array.from(
        dialogElement.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusables.length === 0) {
        event.preventDefault();
        dialogElement.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <Backdrop open={open} sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}>
      <Fade in={open} timeout={shouldReduceMotion ? 0 : theme.transitions.duration.enteringScreen}>
        <Box
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          tabIndex={-1}
          minWidth={320}
          maxWidth={420}
          width="90%"
        >
          <Panel>{children}</Panel>
        </Box>
      </Fade>
    </Backdrop>
  );
};
