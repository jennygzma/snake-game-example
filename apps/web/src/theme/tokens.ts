export const gameTokens = {
  colors: {
    // App surfaces
    bg: "#eff3e9",
    panel: "#f9fbf6",
    panelBorder: "#d6dec8",

    // Primary typography
    text: "#172018",
    textMuted: "#607064",

    // Snake gameplay visuals
    snake: "#1f6d2f",
    snakeHead: "#0d4f20",
    food: "#f15a24",
    boardGrid: "rgba(20, 30, 20, 0.08)",
    boardBg: "#edf3e4",

    // Interactive controls
    action: "#1f6d2f",
    actionHover: "#165425",
    actionText: "#f7fbf4",
    pause: "#8c3f00",
    pauseHover: "#733300",
    pauseText: "#fffaf4",
    neutral: "#d5ddce",
    neutralHover: "#c6cebf",
    neutralText: "#172018",
    danger: "#aa2c2c",
    dangerHover: "#8f1f1f",
    dangerText: "#fff7f7"
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 18
  },
  shadow: {
    panel: "0 6px 18px rgba(26, 42, 26, 0.12)",
    inset: "inset 0 1px 0 rgba(255,255,255,0.4)"
  }
} as const;

export const accessibilityTokens = {
  colors: {
    focusRing: "#2e6a9b"
  },
  shadow: {
    focusRing: "0 0 0 3px rgba(46, 106, 155, 0.45)"
  },
  focus: {
    outlineWidth: "2px",
    outlineOffset: "2px",
    outlineStyle: "solid"
  }
} as const;
