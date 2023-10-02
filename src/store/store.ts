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


type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void
  duplicateNode: (nodeId: string) => void;
  updateNode: (node: Node) => void
  selectedNode: Node | null,
  selectNode: (node: Node | null) => void
  getAllNodeVariables: () => object
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
      nodes: state.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          selected: node.id === newNode.id,
        },
      })).concat(newNode),
    }));
  },
  duplicateNode: (nodeId: string) => {
    const originalNode = get().nodes.find((node) => node.id === nodeId);
    if (originalNode) {
      const newNodeId = `${nodeId}-copy`; 
      const duplicatedNode: Node = {
        ...originalNode,
        id: newNodeId,
        position: {
          x: originalNode.position.x + 50,
          y: originalNode.position.y + 50
        },
        data: {
          ...originalNode.data,
          id: newNodeId,
        },
      };
      set((state) => ({
        nodes: [...state.nodes, duplicatedNode],
      }));
    }
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
  getAllNodeVariables: (): object => {
    let combinedVariables: object = {};

    const allNodes = get().nodes;
  
    allNodes.forEach((node) => {
      if (node.data && node.data.variables) {
        combinedVariables = {
          ...combinedVariables,
          ...node.data.variables
        };
      }
    });
  
    return combinedVariables;
  },
  conversionToXstateCode: () => {
    const nodes = get().nodes;
    const edges = get().edges;
    const context = {};

    nodes.forEach(node => {
      if (node.data.variables) {
        Object.assign(context, node.data.variables);
      }
    });

    const targetMap = {};
    const queryTargetMap = {};
    const outgoingConnections = {};

    nodes.forEach(node => {
      outgoingConnections[node.id] = 0;
    });

    edges.forEach(edge => {
      const { source, target, sourceHandle } = edge;
      targetMap[source] = target;

      if (sourceHandle) {
        queryTargetMap[`${source}_${sourceHandle}`] = target;
      }

      outgoingConnections[source] = (outgoingConnections[source] || 0) + 1;
    });

    const states = {};

    nodes.forEach(node => {
      let nodeType = node.data.stateType;

      if (node.type !== "branchNode" && outgoingConnections[node.id] === 0) {
        nodeType = "final";
      }

      if (node.type === "branchNode") {
        states[node.id] = {
          type: nodeType,
          on: {
            always: node.data.query.map(queryItem => {
              const variable = queryItem.query.split(' ')[0];
              const condition = queryItem.query.split(' ').slice(1).join(' ');
              return {
                target: queryTargetMap[`${node.id}_${queryItem.id}`],
                //
                //cond: `(context, event) => context.${variable} && event.${variable} ${condition}`
                //query propertie
                //
              };
            }).concat({ target: "defaultCond" })
          }
        };
      } else if (node.type === "timeNode") {
        states[node.id] = {
          type: nodeType,
          after: node.data.time ? { [node.data.time.milliseconds]: { target: targetMap[node.id] || 'some_default_state' } } : undefined,
        };
      } else {
        states[node.id] = {
          type: nodeType,
        };
      }
    });
    states.defaultCond = {};


    edges.forEach(edge => {
      const { source, target } = edge;

      const targetNode = nodes.find(n => n.id === target);
      let transitionName = targetNode?.data?.actionName || "next";

      transitionName = transitionName.replace(/ /g, '_');

      if (!states[source].after && !states[source].on?.always) {
        if (!states[source].on) {
          states[source].on = {};
        }
        states[source].on[transitionName] = target;
      }
    });

    const hasBranchNode = nodes.some(node => node.type === "branchNode");
    if (!hasBranchNode) {
      delete states.defaultCond;
    }

    const machine = createMachine({
      id: 'workflow',
      initial: nodes[0].id,
      context,
      states,
    }, {
      guards: {}
    });

    const code = machine.config;
    console.log(JSON.stringify(code, null, 2));
    localStorage.setItem('machine', JSON.stringify(code, null, 2));
  }
}

), shallow)


export default useStore;