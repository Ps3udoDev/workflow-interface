import useInputModal from "../../hooks/useInputModal";
import { useForm } from 'react-hook-form';
import useStore from "../../store/store";
import { useEffect, useState } from "react";
import { Node } from "reactflow";
import Modal from "./Modal";
import { MdDelete } from 'react-icons/md'



interface NodeVariable {
  name: string;
  value: string;
  type: string;
}

interface NodeState {
  label: string;
  background: string | number;
  hidden: boolean;
  variables: NodeVariable[];
  description: string;
  trigger: string;
}
const InputModal = () => {
  const { selectedNode, updateNode, getPropsOfParentNodes } = useStore()
  const inputModal = useInputModal();
  const { handleSubmit, reset } = useForm();

  const initialNodeState: NodeState = {
    label: selectedNode?.data.label || '',
    background: selectedNode?.style?.background || '#27282c',
    hidden: selectedNode?.hidden || false,
    variables: selectedNode?.data.variables || [],
    description: selectedNode?.data.description || '',
    trigger: selectedNode?.data.trigger || ''
  };

  const [nodeState, setNodeState] = useState<NodeState>(initialNodeState);

  const handleUpdateClick = handleSubmit(() => {
    if (selectedNode) {
      const updatedNode: Node = {
        ...selectedNode,
        data: {
          ...selectedNode.data,
          label: nodeState.label,
          variables: nodeState.variables,
          description: nodeState.description,
          trigger: nodeState.trigger,
        },
        style: {
          ...selectedNode.style,
          background: nodeState.background,
        },
        hidden: nodeState.hidden,
      };
      updateNode(updatedNode);
    }
  });

  const handleAddVariable = () => {
    const nextVariableIndex = nodeState.variables.length + 1;
    const newVariable = {
      name: `Variable ${nextVariableIndex}`,
      value: '',
    };

    setNodeState((prevState) => ({
      ...prevState,
      variables: [...prevState.variables, newVariable],
    }));
  };

  const handleVariableChange = (index: number, value: string) => {
    const updatedVariables = [...nodeState.variables];
    updatedVariables[index].value = value;
    setNodeState((prevState) => ({
      ...prevState,
      variables: updatedVariables,
    }));
  };

  const handleVariableNameChange = (index: number, newName: string) => {
    const updatedVariables = [...nodeState.variables];
    updatedVariables[index].name = newName;
    setNodeState((prevState) => ({
      ...prevState,
      variables: updatedVariables,
    }));
  };

  const handleRemoveVariable = (index: number) => {
    const updatedVariables = [...nodeState.variables];
    updatedVariables.splice(index, 1);
    setNodeState((prevState) => ({
      ...prevState,
      variables: updatedVariables,
    }));
  };

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      inputModal.onClose();
    }
  };

  const handleVariableTypeChange = (index: number, newType) => {
    // Aquí puedes manejar el cambio de tipo de variable y ajustar los datos en consecuencia
    const updatedVariables = [...nodeState.variables];
    updatedVariables[index].type = newType;
    // Ajustar el valor de la variable según el nuevo tipo si es necesario
    if (newType === 'number') {
      updatedVariables[index].value = parseFloat(updatedVariables[index].value) | 0;
    } else if (newType === 'boolean') {
      updatedVariables[index].value = updatedVariables[index].value === 'true';
    }
    setNodeState({ ...nodeState, variables: updatedVariables });
  };


  const parentNodesVariables = getPropsOfParentNodes(selectedNode?.id);

  useEffect(() => {
    const updatedNodeState: NodeState = {
      label: selectedNode?.data.label || '',
      background: selectedNode?.style?.background || '#27282c',
      hidden: selectedNode?.hidden || false,
      variables: selectedNode?.data.variables || [],
      description: selectedNode?.data.description || '',
      trigger: selectedNode?.data.trigger || 'CRM'
    };
    setNodeState(updatedNodeState);
  }, [selectedNode]);

  return (
    <Modal
      title='Properties'
      description={`Edit Node Properties ${selectedNode?.data.label}`}
      isOpen={inputModal.isOpen}
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
        <div className='py-2 px-6 flex flex-col gap-1'>
          <label htmlFor="trigger" className='text-sm font-semibold text-white'>
            Trigger:
          </label>
          <select
            className='bg-[#353535] text-white text-sm focus:outline-none focus:border-b border-[#6f62e8] rounded-md h-6'
            onChange={(evt) => setNodeState({ ...nodeState, trigger: evt.target.value })}
          >
            <option value="">Select type of trigger</option>
            <option value='CRM'>CRM</option>
            <option value='ALM'>ALM</option>
            <option value='ATS'>ATS</option>
          </select>
        </div>
        <div className='overflow-auto px-6 flex flex-col gap-3'>
          <h2 className='text-sm font-semibold text-white'>Variables</h2>
          {nodeState.variables.map((variable, index) => (
            <div key={index} className='flex gap-1 border border-green-400'>
              <select
                className='bg-[#353535] text-white text-sm focus:outline-none focus:border-b border-[#6f62e8] rounded-md h-6'
                onChange={(evt) => handleVariableTypeChange(index, evt.target.value)}
              >
                <option value='text'>Text</option>
                <option value='number'>Number</option>
                <option value='boolean'>Boolean</option>
              </select>
              <input
                className='bg-[#353535] text-white text-sm focus:outline-none focus:border-b border-[#6f62e8] rounded-md h-6'
                placeholder={variable.name}
                onChange={(evt) => handleVariableNameChange(index, evt.target.value)}
              />
              :
              <input
                className='bg-[#353535] text-white text-sm focus:outline-none focus:border-b border-[#6f62e8] rounded-md h-6'
                placeholder={variable.value}
                onChange={(evt) => handleVariableChange(index, evt.target.value)}
              />
              <button
                className='text-red-600  rounded-xl text-xl border border-blue-500 m-0'
                onClick={() => handleRemoveVariable(index)}
              >
                <MdDelete />
              </button>
            </div>
          ))}

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
          <button className='text-white bg-[#6f62e8] rounded-xl w-36 m-auto' onClick={handleAddVariable}>Add Variable</button>
          <button className='text-white bg-[#6f62e8] rounded-xl w-36 m-auto'>Update Node</button>
        </div>
      </form>
    </Modal>
  )
}

export default InputModal
