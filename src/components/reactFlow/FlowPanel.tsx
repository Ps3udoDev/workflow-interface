import 'reactflow/dist/style.css';
import useStore from '../../store/store';
import ReactFlow, { Background, Controls, MiniMap, Node, NodeTypes, ReactFlowInstance } from 'reactflow';
import InputNode from './Nodes/InputNode';
import { useCallback, useRef, useState } from 'react';
import PanelTypes from '../panels/PanelTypes';
import InputModal from '../modals/InputModal';
import DefaultNode from './Nodes/DefaultNode';
import DefaultModal from '../modals/DefaultModal';
import OutputNode from './Nodes/OutputNode';
import OutputModal from '../modals/OutputModal';
import TimeModal from '../modals/TimeModal';
import TimeNode from './Nodes/TimeNode';
import BranchNode from './Nodes/BranchNode';
import BranchModal from '../modals/BranchModal';
import ConditionalSubnode from './Nodes/ConditionalNode';

const nodeTypes: NodeTypes = {
  inputNode: InputNode,
  defaultNode: DefaultNode,
  outputNode: OutputNode,
  timeNode: TimeNode,
  branchNode: BranchNode,
  conditionalSubnode: ConditionalSubnode
}

let id = 0;
const getId = () => `Node_${id++}`;

const FlowPanel = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, selectNode } = useStore();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();

  console.log(nodes)


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
          trigger?: string;
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
          height: 50
        },
      }

      if (type === 'inputNode') {
        baseNode.data.description = '';
        baseNode.data.variables = [];
        baseNode.data.trigger = ''
      } else if (type === 'defaultNode' || type === 'outputNode') {
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

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    selectNode(node); 
  };

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
        onNodeClick={onNodeClick}
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
        <InputModal />
        <DefaultModal />
        <OutputModal />
        <TimeModal />
        <BranchModal />
      </div>
    </div>
  )
}

export default FlowPanel
