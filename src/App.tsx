import { createTheme, MantineProvider } from '@mantine/core';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { store } from './store';

const theme = createTheme({});
const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </Provider>
);
