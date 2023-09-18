import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow'

import initialNodes from './nodes'
import initialEdges from './edges'


type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void
}

const useStore = createWithEqualityFn<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    const newEdge = {
      ...connection,
      animated: true,
    }
    set({
      edges: addEdge(newEdge, get().edges),
    });
  },
  addNode: (newNode: Node) => {
    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));
  },
}), shallow)


export default useStore;