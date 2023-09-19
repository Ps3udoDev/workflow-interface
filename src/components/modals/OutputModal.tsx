import { useForm } from 'react-hook-form';
import useStore from "../../store/store";
import { useEffect, useState } from "react";
import { Node } from "reactflow";
import Modal from "./Modal";
import useOutputModal from '../../hooks/useOutputModal';

interface NodeState {
  label: string;
  background: string | number;
  hidden: boolean;
  description: string;
}
const OutputModal = () => {
  const { selectedNode, updateNode, getPropsOfParentNodes } = useStore()
  const outputModal = useOutputModal();
  const { handleSubmit, reset } = useForm();

  const initialNodeState: NodeState = {
    label: selectedNode?.data.label || '',
    background: selectedNode?.style?.background || '#27282c',
    hidden: selectedNode?.hidden || false,
    description: selectedNode?.data.description || '',
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
        },
        hidden: nodeState.hidden,
      };
      updateNode(updatedNode);
    }
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      outputModal.onClose();
    }
  };

  const parentNodesVariables = getPropsOfParentNodes(selectedNode?.id);

  useEffect(() => {
    const updatedNodeState: NodeState = {
      label: selectedNode?.data.label || '',
      background: selectedNode?.style?.background || '#27282c',
      hidden: selectedNode?.hidden || false,
      description: selectedNode?.data.description || '',
    };
    setNodeState(updatedNodeState);
  }, [selectedNode]);

  return (
    <Modal
      title='Properties'
      description={`Edit Node Properties ${selectedNode?.data.label}`}
      isOpen={outputModal.isOpen}
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
          <button className='text-white bg-[#6f62e8] rounded-xl w-36 m-auto'>Update Node</button>
        </div>
      </form>
    </Modal>
  )
}

export default OutputModal
