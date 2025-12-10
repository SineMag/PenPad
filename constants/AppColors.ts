const primaryBlueGreen = '#2D8BBA';
const darkBlueGreen = '#1A6B8F'; // Darker for accents or dark mode background
const lightCreamWhite = '#FDFDED';
const darkCreamWhite = '#E0E0C8'; // Slightly darker for backgrounds in light mode

export const AppColors = {
  light: {
    primary: primaryBlueGreen,
    accent: darkBlueGreen,
    background: lightCreamWhite,
    text: '#333333', // Dark text on light background
    secondaryText: '#666666',
    border: '#CCCCCC',
    cardBackground: '#FFFFFF',
    tabIconDefault: '#AAAAAA',
    tabIconSelected: primaryBlueGreen,
  },
  dark: {
    primary: primaryBlueGreen,
    accent: lightCreamWhite,
    background: '#121212', // Dark background for dark mode
    text: lightCreamWhite, // Light text on dark background
    secondaryText: '#BBBBBB',
    border: '#555555',
    cardBackground: '#222222',
    tabIconDefault: '#BBBBBB',
    tabIconSelected: lightCreamWhite,
  },
};
