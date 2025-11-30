/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const primaryColor = "#37b2ff";
export const secondaryColor = "#ffd700";
export const tertiary = "#8c222c";
export const whiteColor = "#ffffff";
export const blackColor = "#000000";
export const grayColor = "#808080";

export const Colors = {
  light: {
    text: blackColor,
    background: whiteColor,
    primary: primaryColor,
    secondary: secondaryColor,
  },
  dark: {
    text: blackColor,
    background: whiteColor,
    primary: primaryColor,
    secondary: secondaryColor,
  },
};

export type ColorKey = keyof typeof Colors.light;
export type ColorTheme = typeof Colors.light & typeof Colors.dark;

export const roleColors = {
  caregiver: {
    light: {
      ...Colors.light,
      primary: primaryColor,
    },
    dark: {
      ...Colors.dark,
      primary: primaryColor,
    },
  },
  "pet-owner": {
    light: {
      ...Colors.light,
      primary: primaryColor,
    },
    dark: {
      ...Colors.dark,
      primary: primaryColor,
    },
  },
};
