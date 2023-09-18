import 'reactflow/dist/style.css';

import useStore from '../../store/store';
import ReactFlow, { Background, Controls, MiniMap, Node, NodeTypes, ReactFlowInstance } from 'reactflow';
import InputNode from './Nodes/InputNode';
import { useCallback, useRef, useState } from 'react';
import PanelTypes from '../panels/PanelTypes';

const nodeTypes: NodeTypes = {
  inputNode: InputNode,
}

let id = 0;
const getId = () => `Node_${id++}`;

const FlowPanel = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useStore();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();



  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      interface CustomNode extends Node {
        data: {
          label: string;
          description?: string;
          variables?: [];
          time?: {
            units: string,
            value: string
          };
          query?: string;
        }
      }

      const baseNode: CustomNode = {
        id: getId(),
        type,
        position,
        data: {
          label: `Node ${id}`,
        },
        style: {
          background: '#27282c',
          borderRadius: '6px',
          border: 'solid 1px #6f62e8',
        },
      }

      if (type === 'defaultNode' || type === 'inputNode' || type === 'outputNode') {
        baseNode.data.description = '';
        baseNode.data.variables = [];
      } else if (type === 'tymeNode') {
        baseNode.data.time = {
          units: '',
          value: '',
        };
      } else {
        baseNode.data.variables = [];
        baseNode.data.query = '';
      }

      const newNode = { ...baseNode };
      addNode(newNode)

    },
    [addNode, reactFlowInstance]
  );

  return (
    <div className="flex w-full h-full items-center gap-2" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Background />
        <Controls className='bg-white' />
      </ReactFlow>
      <hr className="border-r-2 border-gray-500 h-5/6" />
      <div className='h-screen px-4 flex flex-col items-center justify-center gap-3'>
        <div className='py-4 border rounded-lg border-[#6f62e8] w-64 overflow-hidden'>
          <PanelTypes />
        </div>
      </div>
    </div>
  )
}

export default FlowPanel