import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#2196F3',
    },
    background: {
      default: '#F5F5F5',
    },
    text: {
      primary: '#000000',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#FF9800',
    },
    secondary: {
      main: '#9E9E9E',
    },
    background: {
      default: '#1c1d1f',
    },
    text: {
      primary: '#800080',
    },
  },
});

export { lightTheme, darkTheme };
