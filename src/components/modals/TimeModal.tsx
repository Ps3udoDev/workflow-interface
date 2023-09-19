import { useEffect, useState } from 'react';
import Modal from './Modal';
import { useForm } from 'react-hook-form';
import { Node } from 'reactflow';
import useTimeModal from '../../hooks/useTimeModal';
import useStore from '../../store/store';


interface NodeState {
  label: string;
  background: string | number;
  hidden: boolean;
  time: {
    value: number;
    units: string;
    milliseconds: number;
  };
}

const TimeModal = () => {
  const { selectedNode, updateNode } = useStore()

  const propertiesModal = useTimeModal();
  const { handleSubmit, reset } = useForm();

  const initialNodeState: NodeState = {
    label: selectedNode?.data.label || '',
    background: selectedNode?.style?.background || '#27282c',
    hidden: selectedNode?.hidden || false,
    time: {
      value: selectedNode?.data.time?.value || 0,
      units: selectedNode?.data.time?.units || 'seconds',
      milliseconds: selectedNode?.data.time?.milliseconds || 0,
    },
  };

  const [nodeState, setNodeState] = useState<NodeState>(initialNodeState);

  const [isCounting, setIsCounting] = useState(false); // Nuevo estado para controlar el contador

  const handleUpdateClick = handleSubmit(() => {
    if (selectedNode) {
      const { label, background, hidden, time } = nodeState;
      const updatedNode: Node = {
        ...selectedNode,
        data: {
          ...selectedNode.data,
          label,
          time: {
            value: time.value,
            units: time.units,
            milliseconds: time.milliseconds,
          },
        },
        style: {
          ...selectedNode.style,
          background,
        },
        hidden,
      };

      setIsCounting(false);

      updateNode(updatedNode);
    }
  });

  const handleTimeValueChange = (value: number) => {
    const updatedTime = { ...nodeState.time, value };
    setNodeState({ ...nodeState, time: updatedTime });
    calculateMilliseconds(updatedTime);
  };

  const handleTimeUnitsChange = (units: string) => {
    const updatedTime = { ...nodeState.time, units };
    setNodeState({ ...nodeState, time: updatedTime });
    calculateMilliseconds(updatedTime);
  };

  const calculateMilliseconds = (time: { value: number; units: string }) => {
    const { value, units } = time;
    let milliseconds = 0;

    switch (units) {
      case 'seconds':
        milliseconds = value * 1000;
        break;
      case 'minutes':
        milliseconds = value * 60 * 1000;
        break;
      case 'hours':
        milliseconds = value * 60 * 60 * 1000;
        break;
      case 'days':
        milliseconds = value * 24 * 60 * 60 * 1000;
        break;
      default:
        break;
    }

    const updatedTime = { ...time, milliseconds };
    setNodeState({ ...nodeState, time: updatedTime });
  };

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      propertiesModal.onClose();
    }
  };

  useEffect(() => {
    const updatedNodeState: NodeState = {
      label: selectedNode?.data.label || '',
      background: selectedNode?.style?.background || '#27282c',
      hidden: selectedNode?.hidden || false,
      time: {
        value: selectedNode?.data.time?.value || 0,
        units: selectedNode?.data.time?.units || 'seconds',
        milliseconds: selectedNode?.data.time?.milliseconds || 0,
      },
    };
    setNodeState(updatedNodeState);
  }, [selectedNode]);

  return (
    <Modal
      title='Properties'
      description={`Edit Time Node Properties: ${selectedNode?.data.label}`}
      isOpen={propertiesModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleUpdateClick} className='flex flex-col w-[450px] max-h-[600px] h-auto'>
        {/* ... Rest of the form inputs ... */}
        <div className='py-2 px-6 flex flex-col gap-1'>
          <label htmlFor="timeValue" className='text-sm font-semibold text-white'>
            Time Value:
          </label>
          <input
            type="number"
            min="0"
            className='bg-[#353535] text-white text-sm focus:outline-none focus:border-b border-[#6f62e8] w-full rounded-md h-8'
            onChange={(evt) => handleTimeValueChange(parseFloat(evt.target.value))}
            value={nodeState.time.value}
          />
        </div>
        <div className='py-2 px-6 flex flex-col gap-1'>
          <label htmlFor="timeUnits" className='text-sm font-semibold text-white'>
            Time Units:
          </label>
          <select
            className='bg-[#353535] text-white text-sm focus:outline-none focus:border-b border-[#6f62e8] w-full rounded-md h-8'
            onChange={(evt) => handleTimeUnitsChange(evt.target.value)}
            value={nodeState.time.units}
          >
            <option value='seconds'>Seconds</option>
            <option value='minutes'>Minutes</option>
            <option value='hours'>Hours</option>
            <option value='days'>Days</option>
          </select>
        </div>
        <div className='flex flex-col gap-2 py-2'>
          <button className='text-white bg-[#6f62e8] rounded-xl w-36 m-auto'>Update Node</button>
        </div>
      </form>
    </Modal>
  );
};

export default TimeModal;
