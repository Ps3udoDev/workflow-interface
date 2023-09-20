import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import { createMachine } from 'xstate';


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
import { States } from '../utils/types';


type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void
  updateNode: (node: Node) => void
  selectedNode: Node | null,
  selectNode: (node: Node | null) => void
  getPropsOfParentNodes: (childNodeId: string | undefined) => object[]
  conversionToXstateCode: () => void
}

const useStore = createWithEqualityFn<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
    localStorage.setItem('nodes', JSON.stringify(get().nodes));
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
    localStorage.setItem('edges', JSON.stringify(get().edges));
  },
  addNode: (newNode: Node) => {
    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));
  },
  updateNode: (updatedNode: Node) => {
    set((state) => ({
      nodes: state.nodes.map((node) => (node.id === updatedNode.id ? updatedNode : node)),
    }));
  },
  selectedNode: null,
  selectNode: (node: Node | null) => {
    set({ selectedNode: node });
  },
  getPropsOfParentNodes: (childNodeId: string | undefined): object[] => {
    const parentEdges = get().edges.filter((edge) => edge.target === childNodeId);
    const parentNodeProps: Node[] = [];

    parentEdges.forEach((parentEdge) => {
      const parentNodeId = parentEdge.source;
      const parentNode = get().nodes.find((node) => node.id === parentNodeId);
      if (parentNode) {
        parentNodeProps.push(parentNode.data);
      }
    });

    return parentNodeProps;
  },
  conversionToXstateCode: () => {
    const nodes = get().nodes
    const edges = get().edges

    const states: States = {};

    nodes.forEach(node => {
      states[node.id] = {};
    });

    edges.forEach(edge => {
      const { source, target } = edge;    
      const transitionName = `${source}_${target}`.replace(/-/g, '_');
      
      if (!states[source].on) {
        states[source].on = {};
      }
      
      states[source].on[transitionName] = target;
    });

    const machine = createMachine({
      id: 'workflow',
      initial: nodes[0].id,
      states,
    });

    const code = machine.config;
    localStorage.setItem('machine', JSON.stringify(code, null, 2));
  }
}), shallow)


export default useStore;