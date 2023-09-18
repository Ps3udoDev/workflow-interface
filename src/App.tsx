import {ReactFlowProvider} from 'reactflow'
import FlowPanel from './components/reactFlow/FlowPanel'
import useStore from './store/store';
import { useEffect } from 'react';

const App = () => {
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
    <>
    <div className='bg-[#1c1d1f]'>
      <ReactFlowProvider>
        <div className='border-2 border-blue-600 m-auto items-center justify-center w-full h-screen'>
          <FlowPanel />
        </div>
      </ReactFlowProvider>
    </div>
    </>
  )
}

export default App