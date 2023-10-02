import 'reactflow/dist/style.css';
import useStore from '../../store/store';
import ReactFlow, { Background, Controls, MiniMap, Node, NodeTypes, ReactFlowInstance } from 'reactflow';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import BranchNode from './Nodes/BranchNode';
import AddNodes from '../panels/AddNodes';
import { useTheme } from '@mui/material';
import UpdateModal from '../modals/UpdateModal';
import { getAllNodes, getUniqueNodeId, initNode } from '../../utils/helper';
import CustomNode from './CustomNode';

const nodeTypes: NodeTypes = {
  branchNode: BranchNode,
  customNode: CustomNode
}

const FlowPanel = () => {
  const theme = useTheme();
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, selectNode } = useStore();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();
  const [nodesData, setNodesData] = useState([]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      let type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }
      type = JSON.parse(type)

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNodeId = getUniqueNodeId(type, reactFlowInstance?.getNodes())

      const newNode: Node = {
        id: newNodeId,
        position,
        type: 'customNode',
        data: initNode(type, newNodeId)
      };
      addNode(newNode)

    },
    [addNode, reactFlowInstance]
  );

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    selectNode(node);
  };

  useEffect(() => {
    const fetchNodes = async () => {
      const allNodes = await getAllNodes();
      setNodesData(allNodes);
    };

    fetchNodes();
  }, []);
console.log(nodes)
  return (
    <div className="flex w-full h-full items-center gap-2" ref={reactFlowWrapper} style={{ backgroundColor: theme.palette.background.default }}>
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
        <AddNodes nodesData={nodesData} />
        <Controls className='bg-white' />
      </ReactFlow>
      <UpdateModal />
    </div>
  )
}

export default FlowPanel
