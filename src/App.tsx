import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './themes';
import { ReactFlowProvider } from 'reactflow';
import FlowPanel from './components/reactFlow/FlowPanel';
import useStore from './store/store';
import Header from './components/common/Header';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const storedNodes = localStorage.getItem('nodes');
    const storedEdges = localStorage.getItem('edges');
    if (storedNodes && storedEdges) {
      useStore.setState({
        nodes: JSON.parse(storedNodes),
        edges: JSON.parse(storedEdges),
      });
    }
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <div className="flex flex-col h-screen">
        <Header toggleDarkMode={toggleDarkMode} />

        <ReactFlowProvider>
          <FlowPanel />
        </ReactFlowProvider>
      </div>
    </ThemeProvider>
  );
};

export default App;
