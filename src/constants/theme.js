import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const COLORS = {
    // base colors
    primary: "#00996D", // Green
    secondary: "#606d87",   // Gray

    // colors
    black: "#1E1F20",
    white: "#FFFFFF",
    lightGray: "#eff2f5",
    gray: "#BEC1D2",
    darkgray: '#898C95',
    lightGreen: '#e6f7f2',
    lightGreen2: '#e9f9f7',
    lightGreen3: '#ebf6f7',
    lightBlue: '#a7c5eb',
    lightGray2: '#f6f6f7',
    transparent: 'transparent',
    darkGreen: '#00996D',
    darkGreen2: '#00816A',
    darkGreen3: '#006C5F',
    darkGreen4: '#005C55',
    darkGreen5: '#004C4C',
    darkGreen6: '#003C43',
    darkGreen7: '#00313A',
    darkGreen8: '#002630',
    darkGreen9: '#001B27',
    darkGreen10: '#00111D',
    red: '#FF0000',
    red2: '#D60000',
    red3: '#B30000',
    red4: '#8C0000',
    red5: '#660000',
    red6: '#3F0000',
    green: '#008C00',
    
    
};
export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,

    // font sizes
    largeTitle: 50,
    h1: 30,
    h2: 22,
    h3: 16,
    h4: 14,
    body1: 30,
    body2: 22,
    body3: 16,
    body4: 14,

    // app dimensions
    width,
    height
};
export const FONTS = {
    largeTitle: { fontFamily: "Roboto-Black", fontSize: SIZES.largeTitle, lineHeight: 55 },
    h1: { fontFamily: "Roboto-Black", fontSize: SIZES.h1, lineHeight: 36 },
    h2: { fontFamily: "Roboto-Bold", fontSize: SIZES.h2, lineHeight: 30 },
    h3: { fontFamily: "Roboto-Bold", fontSize: SIZES.h3, lineHeight: 22 },
    h4: { fontFamily: "Roboto-Bold", fontSize: SIZES.h4, lineHeight: 22 },
    body1: { fontFamily: "Roboto-Regular", fontSize: SIZES.body1, lineHeight: 36 },
    body2: { fontFamily: "Roboto-Regular", fontSize: SIZES.body2, lineHeight: 30 },
    body3: { fontFamily: "Roboto-Regular", fontSize: SIZES.body3, lineHeight: 22 },
    body4: { fontFamily: "Roboto-Regular", fontSize: SIZES.body4, lineHeight: 22 },
};



const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
