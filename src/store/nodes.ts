import { Node } from "reactflow";

export default [
  {
    id: 'Node_init',
    type: 'inputNode',
    data: { label: 'Node_1', trigger: 'CRM', variables: [], description: '' },
    position: { x: 250, y: 25 },
    style: {
      background: '#27282c',
      borderRadius: '6px',
      border: 'solid 1px #6f62e8',
    },
  },
] as Node[];