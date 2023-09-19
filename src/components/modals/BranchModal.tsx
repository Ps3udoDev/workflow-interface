import { useForm } from 'react-hook-form';
import useStore from "../../store/store";
import { useEffect, useState } from "react";
import { Node } from "reactflow";
import Modal from "./Modal";
import useBranchModal from '../../hooks/useBranchModal';
import QueryBuilderPanel from '../panels/QueryBuilderPanel';

interface NodeState {
  label: string;
  background: string | number;
  hidden: boolean;
  description: string;
  height: number;
}

interface Field {
  name: string;
  label: string;
}

let id = 0;

const BranchModal = () => {
  const { selectedNode, updateNode, getPropsOfParentNodes, addNode } = useStore()
  const branchModal = useBranchModal();
  const { handleSubmit, reset } = useForm();
  const [query, setQuery] = useState<string>('');

  const initialNodeState: NodeState = {
    label: selectedNode?.data.label || '',
    background: selectedNode?.style?.background || '#27282c',
    hidden: selectedNode?.hidden || false,
    description: selectedNode?.data.description || '',
    height: selectedNode?.height || 0
  };

  const [nodeState, setNodeState] = useState<NodeState>(initialNodeState);

  const handleUpdateClick = handleSubmit(() => {
    if (selectedNode) {
      const updatedNode: Node = {
        ...selectedNode,
        data: {
          ...selectedNode.data,
          label: nodeState.label,
          description: nodeState.description,
        },
        style: {
          ...selectedNode.style,
          background: nodeState.background,
          height: nodeState.height,
        },
        hidden: nodeState.hidden,

      };
      updateNode(updatedNode);
    }
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      branchModal.onClose();
    }
  };

  const updateQuery = (newQuery: string) => {
    setQuery(newQuery);
  };

  /* const onAddClick = (event) => {
    event.preventDefault();

    const parentId = selectedNode?.id;
    const newNode:Node = {
      id: `${parentId}.${id++}`,
      type: 'conditionalSubnode',
      data: { label: 'Added node', variables: [],query: query },
      style: {
        background: '#27282c',
        borderRadius: '6px',
        border: 'solid 1px #6f62e8'
      },
      position: {
        x: 0,
        y: 0,
      },
      parentNode: parentId,
      extent: 'parent',
    };

    addNode(newNode)
  }; */
  const onAddClick = (event) => {
    event.preventDefault();

    const parentId = selectedNode?.id;

    const newNode = {
      id: `${parentId}.${id++}`,
      type: 'conditionalSubnode',
      data: { label: 'Added node', variables: [], query: query },
      style: {
        background: '#27282c',
        borderRadius: '6px',
        border: 'solid 1px #6f62e8',
      },
      position: {
        x: 0,
        y: 0,
      },
      height: 200,
      parentNode: parentId,
      extent: 'parent',
    };
   // const cantidadDeNodosHijos = id;

    // Agrega el nuevo nodo primero
    addNode(newNode);

    // Luego, incrementa la cantidad de nodos hijos en el nodo padre
   /*  if (selectedNode) {
      updateNode({
        ...selectedNode,
        data: {
          ...selectedNode?.data,
          childCount: cantidadDeNodosHijos,
        },
      });
    }
    const newHeigth = selectedNode?.style?.height * cantidadDeNodosHijos
    if (selectedNode) {
      updateNode({
        ...selectedNode,
        style: {
          ...selectedNode?.style,
          height: newHeigth,
        },
      });
    } */
  };



  function convertVariablesToFields(data: object[]): Field[] {
    const fields: Field[] = [];
    data.forEach((nodeData) => {
      const nodeVariables = nodeData.variables || [];
      nodeVariables.forEach(element => {
        const label = element.name.charAt(0).toUpperCase() + element.name.slice(1);
        fields.push({ name: element.name, label });
      });
      console.log(nodeVariables)
    });

    return fields;
  }

  const parentNodesVariables = getPropsOfParentNodes(selectedNode?.id);
  const fields: Field[] = convertVariablesToFields(parentNodesVariables);

  useEffect(() => {
    const updatedNodeState: NodeState = {
      label: selectedNode?.data.label || '',
      background: selectedNode?.style?.background || '#27282c',
      hidden: selectedNode?.hidden || false,
      description: selectedNode?.data.description || '',
      height: selectedNode?.height || 0
    };
    setNodeState(updatedNodeState);
  }, [selectedNode]);


  return (
    <Modal
      title='Properties'
      description={`Edit Node Properties ${selectedNode?.data.label}`}
      isOpen={branchModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleUpdateClick} className='flex flex-col w-[450px] max-h-[600px] h-auto'>
        <div className='py-2 px-6 flex flex-col gap-1 items-start justify-center'>
          <label htmlFor="label" className='text-sm font-semibold text-white'>
            Node Name:
          </label>
          <input
            className='bg-[#353535] text-white text-sm focus:outline-none focus:border-b border-[#6f62e8] w-full rounded-md h-8'
            type="text"
            onChange={(evt) => (setNodeState({ ...nodeState, label: evt.target.value }))}
            placeholder={selectedNode?.data['label']} />
        </div>
        <div className='py-2 px-6 flex  items-center justify-start gap-3'>
          <div className='flex items-center gap-3'>
            <label htmlFor="nameNode" className='text-sm font-semibold text-white'>
              Background:
            </label>
            <input className='bg-[#353535] text-white text-sm focus:outline-none focus:border-b border-[#6f62e8] rounded-md h-8' type="color" id='nodeBackground' onChange={(evt) => setNodeState({ ...nodeState, background: evt.target.value })} />
          </div>
          <div className='flex items-center gap-3'>
            <label htmlFor="nameNode" className='text-sm font-semibold text-white'>
              Hidden:
            </label>
            <input className='bg-[#353535] text-white text-sm focus:outline-none focus:border-b border-[#6f62e8] rounded-md h-8' type="checkbox" id='nodeHidden' onChange={() => setNodeState({ ...nodeState, hidden: !nodeState.hidden })} />
          </div>
        </div>
        <div className='py-2 px-6 flex flex-col gap-1'>
          <label htmlFor="nameDescription" className='text-sm font-semibold text-white'>
            Description:
          </label>
          <textarea className='bg-[#353535] text-white text-sm focus:outline-none focus:border-b border-[#6f62e8] w-full max-h-32 h-28 rounded-md' name="descriptionNode" onChange={(evt) => setNodeState({ ...nodeState, description: evt.target.value })} placeholder={selectedNode?.data['description']}></textarea>
        </div>
        <div className='w-[600px] overflow-auto'>
          <QueryBuilderPanel fields={fields} updateQuery={updateQuery} />
        </div>
        {parentNodesVariables.length > 0 && (
          <div className='px-6 text-white overflow-auto max-h-[250px] py-3'>
            <h2 className='text-sm font-semibold'>Parent Node Variables</h2>
            {parentNodesVariables.map((parentNodeVariables, index) => (
              <div key={index} className='text-xs mt-2'>
                <h3>{parentNodeVariables?.label}</h3>
                {
                  parentNodeVariables?.variables.map((variable, index) => (
                    <li key={index} className='list-none'>
                      <strong>{variable.name}:</strong> {JSON.stringify(variable.value)}
                    </li>
                  ))}
              </div>
            ))}
          </div>
        )}
        <div className='flex flex-col gap-2 py-2'>
          <button onClick={onAddClick}>Add Query</button>
          <button className='text-white bg-[#6f62e8] rounded-xl w-36 m-auto'>Update Node</button>
        </div>
      </form>
    </Modal>
  )
}

export default BranchModal
