import 'reactflow/dist/style.css';

import useStore from '../../store/store';
import ReactFlow, { Background, Controls, MiniMap, NodeTypes } from 'reactflow';
import InputNode from './Nodes/InputNode';

const nodeTypes: NodeTypes = {
  inputNode: InputNode,
}
const FlowPanel = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore();
  return (
    <div className="flex w-full h-full items-center gap-2">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Background />
        <Controls className='bg-white' />
      </ReactFlow>
      <hr className="border-r-2 border-gray-500 h-5/6" />
      <div className='h-screen px-4 flex flex-col items-center justify-center gap-3'>

        <div className='py-4 overflow-y-auto'>
        <div className='py-4 border rounded-lg border-[#6f62e8] w-64 overflow-hidden'>
        </div>
          <div className='text-white'>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlowPanel