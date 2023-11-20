import { Node } from 'reactflow';
import { SendMail_Node } from '../components/reactFlow/nodes-types/';

export async function getAllNodes() {
  const nodesClasses = await import('../components/reactFlow/nodes-types/');
  const classes = [
    nodesClasses.Input_Node,
    nodesClasses.Default_Node,
    nodesClasses.Time_Node,
    nodesClasses.Branch_Node,
    nodesClasses.SendMail_Node,
    nodesClasses.SendVoiceNode
  ];

  const instances = classes.map(NodeClass => new NodeClass());

  return instances;
}

export const getUniqueNodeId = (nodeData, nodes: Node[]) => {
  let totalSameNodes = 0
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i]
    if (node.data.name === nodeData.name) {
      totalSameNodes += 1
    }
  }

  let nodeId = `${nodeData.name}_${totalSameNodes}`
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i]
    if (node.id === nodeId) {
      totalSameNodes += 1
      nodeId = `${nodeData.name}_${totalSameNodes}`
    }
  }
  return nodeId
}

export const initializeDefaultNodeData = (nodeParams) => {
  const initialValues = {}

  for (let i = 0; i < nodeParams.length; i += 1) {
    const input = nodeParams[i]
    initialValues[input.name] = input.default || ''
  }

  return initialValues
}

export const initNode = (nodeData, newNodeId) => {
  const inputAnchors = []
  const inputParams = []
  const incoming = nodeData.inputs ? nodeData.inputs.length : 0
  const outgoing = 1

  const whitelistTypes = ['asyncOptions', 'options', 'string', 'number', 'boolean', 'password', 'json', 'code', 'date', 'file', 'folder']

  // Inputs
  for (let i = 0; i < incoming; i += 1) {
    const newInput = {
      ...nodeData.inputs[i],
      id: `${newNodeId}-input-${nodeData.inputs[i].name}-${nodeData.inputs[i].type}`
    }
    if (whitelistTypes.includes(nodeData.inputs[i].type)) {
      inputParams.push(newInput)
    } else {
      inputAnchors.push(newInput)
    }
  }
  let instance;
  switch (nodeData.name) {
    case 'sendMailNode':
      instance = new SendMail_Node();
      break;
    // ... (otros casos para otros tipos de nodos si los tienes)
  }
  if (nodeData.credential) {
    const newInput = {
      ...nodeData.credential,
      id: `${newNodeId}-input-${nodeData.credential.name}-${nodeData.credential.type}`
    }
    inputParams.unshift(newInput)
  }

  const outputAnchors = []
  for (let i = 0; i < outgoing; i += 1) {
    if (nodeData.outputs && nodeData.outputs.length) {
      const options = []
      for (let j = 0; j < nodeData.outputs.length; j += 1) {
        let baseClasses = ''
        let type = ''

        const outputBaseClasses = nodeData.outputs[j].baseClasses ?? []
        if (outputBaseClasses.length > 1) {
          baseClasses = outputBaseClasses.join('|')
          type = outputBaseClasses.join(' | ')
        } else if (outputBaseClasses.length === 1) {
          baseClasses = outputBaseClasses[0]
          type = outputBaseClasses[0]
        }

        const newOutputOption = {
          id: `${newNodeId}-output-${nodeData.outputs[j].name}-${baseClasses}`,
          name: nodeData.outputs[j].name,
          label: nodeData.outputs[j].label,
          type
        }
        options.push(newOutputOption)
      }
      const newOutput = {
        name: 'output',
        label: 'Output',
        type: 'options',
        options,
        default: nodeData.outputs[0].name
      }
      outputAnchors.push(newOutput)
    } else {
      const newOutput = {
        id: `${newNodeId}-output-${nodeData.name}-${nodeData.baseClasess.join('|')}`,
        name: nodeData.name,
        label: nodeData.type,
        type: nodeData.baseClasess.join(' | ')
      }
      outputAnchors.push(newOutput)
    }
  }

  if (nodeData.inputs) {
    nodeData.inputAnchors = inputAnchors
    nodeData.inputParams = inputParams
    nodeData.inputs = initializeDefaultNodeData(nodeData.inputs)
  } else {
    nodeData.inputAnchors = []
    nodeData.inputParams = []
    nodeData.inputs = {}
  }

  // Outputs
  if (nodeData.outputs) {
    nodeData.outputs = initializeDefaultNodeData(outputAnchors)
  } else {
    nodeData.outputs = {}
  }
  nodeData.outputAnchors = outputAnchors

  // Credential
  if (nodeData.credential) nodeData.credential = ''

  nodeData.id = newNodeId

  return { nodeData: nodeData, instance: instance };
}