import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    game: {
      snake: string;
      snakeHead: string;
      food: string;
      boardBg: string;
      boardGrid: string;
      action: string;
      actionHover: string;
      actionText: string;
      pause: string;
      pauseHover: string;
      pauseText: string;
      neutral: string;
      neutralHover: string;
      neutralText: string;
      danger: string;
      dangerHover: string;
      dangerText: string;
    };
    icons: {
      default: string;
      active?: string;
      gameActive?: string;
      statsActive?: string;
      hubActive?: string;
      settingsActive?: string;
      add?: string;
      barChart?: string;
      check?: string;
      close?: string;
      delete?: string;
      edit?: string;
      play?: string;
      pause?: string;
      photoCamera?: string;
      public?: string;
      reset?: string;
      settings?: string;
      sportsEsports?: string;
      stats?: string;
      swapHoriz?: string;
      warning?: string;
    };
    ui: {
      // Global app chrome and top navigation
      nav: {
        topBarBg: string;
        topBarBorder: string;
        topBarShadow: string;
        profileHoverBg: string;
        profileAvatarBg: string;
        profileNameText: string;
        iconActiveColor: string;
        iconInactiveColor: string;
        iconLabelColor: string;
        tooltipBg: string;
        tooltipText: string;
      };
      // Cross-page status/error messaging surfaces
      feedback: {
        errorText: string;
        errorBg: string;
        errorBorder: string;
      };
      // Profile-specific controls and indicators
      profile: {
        activeChipBg: string;
        activeChipText: string;
        deleteButtonBg: string;
        deleteButtonHoverBg: string;
        deleteButtonText: string;
      };
      // Settings page message styling
      settings: {
        errorText: string;
      };
      // Profile feature components
      profileCard: {
        avatarBg: string;
      };
      profilePicker: {
        newCardBorder: string;
        newCardHoverBorder: string;
        newCardHoverBg: string;
        mutedText: string;
      };
      avatarUpload: {
        avatarBg: string;
        helperText: string;
        errorText: string;
        deleteIcon: string;
      };
      // Dialogs, warnings, and destructive actions
      dialog: {
        descriptionText: string;
        warningBg: string;
        warningBorder: string;
        warningTitle: string;
        warningBody: string;
        destructiveButtonBg: string;
        destructiveButtonHoverBg: string;
      };
      // Game and stats page panels
      leaderboard: {
        mutedText: string;
        divider: string;
      };
      stats: {
        tabsBorder: string;
      };
      // Shared primitives
      shared: {
        panelBorder: string;
      };
      statCard: {
        labelText: string;
      };
      // Game board rendering surface
      gameBoard: {
        border: string;
      };
      // Theme editor controls
      themeGallery: {
        mutedText: string;
        swatchBorder: string;
        activeChipBg: string;
        activeChipText: string;
        appliedChipBg: string;
        appliedChipText: string;
      };
      colorPicker: {
        swatchBorder: string;
        swatchFocusRing: string;
      };
    };
  }

  interface ThemeOptions {
    game?: {
      snake?: string;
      snakeHead?: string;
      food?: string;
      boardBg?: string;
      boardGrid?: string;
      action?: string;
      actionHover?: string;
      actionText?: string;
      pause?: string;
      pauseHover?: string;
      pauseText?: string;
      neutral?: string;
      neutralHover?: string;
      neutralText?: string;
      danger?: string;
      dangerHover?: string;
      dangerText?: string;
    };
    icons?: {
      default?: string;
      active?: string;
      gameActive?: string;
      statsActive?: string;
      hubActive?: string;
      settingsActive?: string;
      add?: string;
      barChart?: string;
      check?: string;
      close?: string;
      delete?: string;
      edit?: string;
      play?: string;
      pause?: string;
      photoCamera?: string;
      public?: string;
      reset?: string;
      settings?: string;
      sportsEsports?: string;
      stats?: string;
      swapHoriz?: string;
      warning?: string;
    };
    ui?: {
      nav?: {
        topBarBg?: string;
        topBarBorder?: string;
        topBarShadow?: string;
        profileHoverBg?: string;
        profileAvatarBg?: string;
        profileNameText?: string;
        iconActiveColor?: string;
        iconInactiveColor?: string;
        iconLabelColor?: string;
        tooltipBg?: string;
        tooltipText?: string;
      };
      feedback?: {
        errorText?: string;
        errorBg?: string;
        errorBorder?: string;
      };
      profile?: {
        activeChipBg?: string;
        activeChipText?: string;
        deleteButtonBg?: string;
        deleteButtonHoverBg?: string;
        deleteButtonText?: string;
      };
      settings?: {
        errorText?: string;
      };
      profileCard?: {
        avatarBg?: string;
      };
      profilePicker?: {
        newCardBorder?: string;
        newCardHoverBorder?: string;
        newCardHoverBg?: string;
        mutedText?: string;
      };
      avatarUpload?: {
        avatarBg?: string;
        helperText?: string;
        errorText?: string;
        deleteIcon?: string;
      };
      dialog?: {
        descriptionText?: string;
        warningBg?: string;
        warningBorder?: string;
        warningTitle?: string;
        warningBody?: string;
        destructiveButtonBg?: string;
        destructiveButtonHoverBg?: string;
      };
      leaderboard?: {
        mutedText?: string;
        divider?: string;
      };
      stats?: {
        tabsBorder?: string;
      };
      shared?: {
        panelBorder?: string;
      };
      statCard?: {
        labelText?: string;
      };
      gameBoard?: {
        border?: string;
      };
      themeGallery?: {
        mutedText?: string;
        swatchBorder?: string;
        activeChipBg?: string;
        activeChipText?: string;
        appliedChipBg?: string;
        appliedChipText?: string;
      };
      colorPicker?: {
        swatchBorder?: string;
        swatchFocusRing?: string;
      };
    };
  }
}
