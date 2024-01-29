import { createTheme , ThemeProvider  } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Main from './components/main'


const darkTheme = createTheme ({
  palette: {
    mode: 'dark',
  },
});


export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Main/>
    </ThemeProvider>
  );
}