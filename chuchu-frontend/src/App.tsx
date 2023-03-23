import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Navigation from './Navigation/Navigation';
import React, { useEffect } from 'react';
import { useInitStore } from 'CardStore';
import { createTheme, CssBaseline, IconButton, ThemeProvider } from '@mui/material';
import NightlightIcon from '@mui/icons-material/Nightlight';
import LightModeIcon from '@mui/icons-material/LightMode';

const App: React.FC = (props) => {
    const initStore = useInitStore();
    const [mode, setMode] = React.useState<'light' | 'dark'>('light');

    useEffect(() => {
        initStore();
    }, [initStore])


    const theme = React.useMemo(
        () =>
          createTheme({
            palette: {
              mode,
            },
          }),
        [mode],
      );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <BrowserRouter>
                    <Navigation />
                    <IconButton 
                        onClick={() => setMode(prev => prev === 'dark' ? 'light' : 'dark')} 
                        sx={{ position: 'absolute', top: '15px', right: '15px' }}
                    >
                        { mode === 'dark' ? <NightlightIcon /> : <LightModeIcon /> }
                    </IconButton>
                </BrowserRouter>
            </CssBaseline>
        </ThemeProvider>
    );
}

export default App;
