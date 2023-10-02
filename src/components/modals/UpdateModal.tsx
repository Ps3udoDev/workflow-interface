import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Node } from 'reactflow';
import Modal from './Modal';
import useStore from '../../store/store';
import ReactJson, { OnCopyProps } from 'react-json-view';
import useUpdateModal from '../../hooks/useUpdateModal';
import QueryBuilderPanel from '../panels/QueryBuilderPanel';
import { queryType } from '../../utils/types';

interface NodeState {
  label: string;
  hidden: boolean;
  variables?: object;
  description?: string;
  isParallel: boolean;
  timeData: {
    value: number;
    units: string;
    milliseconds: number;
  };
  height?: number;
}

interface Field {
  name: string;
  label: string;
}

let id = 0;

const UpdateModal = () => {
  const { selectedNode, updateNode, getAllNodeVariables } = useStore();
  const updateModal = useUpdateModal();
  const { handleSubmit, reset } = useForm();
  const [query, setQuery] = useState<string>('');


  const initialNodeState: NodeState = {
    label: selectedNode?.data.label || '',
    hidden: selectedNode?.hidden || false,
    variables: selectedNode?.data.variables || {},
    description: selectedNode?.data.description || '',
    isParallel: selectedNode?.data.isParallel || false,
    timeData: {
      value: selectedNode?.data.time?.value || 0,
      units: selectedNode?.data.time?.units || 'seconds',
      milliseconds: selectedNode?.data.time?.milliseconds || 0,
    },
    height: selectedNode?.height || 0
  };

  const [nodeState, setNodeState] = useState<NodeState>(initialNodeState);
  const [myValue, setMyValue] = useState(initialNodeState.variables || {});

  const handleUpdateClick = handleSubmit(() => {

    if (selectedNode) {

      const { timeData } = nodeState;
      const updatedNode: Node = {
        ...selectedNode,
        data: {
          ...selectedNode.data,
          label: nodeState.label,
          variables: myValue,
          description: nodeState.description,
          isParallel: nodeState.isParallel,
          timeData: {
            value: timeData.value,
            units: timeData.units,
            milliseconds: timeData.milliseconds,
          },
        },
        hidden: nodeState.hidden,
      };
      updateNode(updatedNode);
    }
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      updateModal.onClose();
    }
  };

  const updateQuery = (newQuery: string) => {
    setQuery(newQuery);
  };

  const onAddClick = (event: React.MouseEvent) => {
    event.preventDefault();
    const newQuery: queryType = {
      id: `query_${id++}`,
      query,
    }
    if (selectedNode) {
      updateNode({
        ...selectedNode,
        data: {
          ...selectedNode?.data,
          queryData: [...selectedNode.data.queryData, newQuery]
        }
      })
    }
  };

  function convertVariablesToFields(data: object): Field[] {
    const fields: Field[] = [];
    const nodeVariables = data || {};

    for (const name in nodeVariables) {
      const label = name.charAt(0).toUpperCase() + name.slice(1);
      fields.push({ name, label });
    }

    return fields;
  }

  const parentNodesVariables = getAllNodeVariables();
  console.log('this is parentNodesVariables,\n', parentNodesVariables)
  const fields: Field[] = convertVariablesToFields(parentNodesVariables);

  const onClipboardCopy = (e: OnCopyProps) => {
    const src = e.src
    if (Array.isArray(src) || typeof src === 'object') {
      navigator.clipboard.writeText(JSON.stringify(src, null, '  '))
    } else {
      navigator.clipboard.writeText(src)
    }
  }
  const handleTimeValueChange = (value: number) => {
    const updatedTime = { ...nodeState.timeData, value };
    setNodeState({ ...nodeState, timeData: updatedTime });
    calculateMilliseconds(updatedTime);
  };

  const handleTimeUnitsChange = (units: string) => {
    const updatedTime = { ...nodeState.timeData, units };
    setNodeState({ ...nodeState, timeData: updatedTime });
    calculateMilliseconds(updatedTime);
  };

  const calculateMilliseconds = (timeData: { value: number; units: string }) => {
    const { value, units } = timeData;
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

    const updatedTime = { ...timeData, milliseconds };
    setNodeState({ ...nodeState, timeData: updatedTime });
  };

  useEffect(() => {
    const updatedNodeState: NodeState = {
      label: selectedNode?.data.label || '',
      hidden: selectedNode?.hidden || false,
      variables: selectedNode?.data.variables || {},
      description: selectedNode?.data.description || '',
      isParallel: selectedNode?.data.isParallel || false,
      timeData: {
        value: selectedNode?.data.time?.value || 0,
        units: selectedNode?.data.time?.units || 'seconds',
        milliseconds: selectedNode?.data.time?.milliseconds || 0,
      },
      height: selectedNode?.height || 0
    };
    setNodeState(updatedNodeState);
    setMyValue(selectedNode?.data.variables || {});
  }, [selectedNode]);

  return (
    <Modal
      title='Properties'
      description={`Edit Node Properties: ${selectedNode?.data.label}`}
      isOpen={updateModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleUpdateClick} className='flex flex-col w-auto max-h-[600px] h-auto'>
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
        {(selectedNode?.data.type !== 'Time' && selectedNode?.data.type !== 'Branch') && (
          <>
            <div className='w-[550px]'>
              <div className='py-2 px-6 flex  items-center justify-start gap-3'>
                <div className='flex items-center gap-3'>
                  <label htmlFor="nameNode" className='text-sm font-semibold text-white'>
                    isParallel:
                  </label>
                  <input className='bg-[#353535] text-white text-sm focus:outline-none focus:border-b border-[#6f62e8] rounded-md h-8' checked={nodeState.isParallel} type="checkbox" id='nodeParalle' onChange={() => setNodeState({ ...nodeState, isParallel: !nodeState.isParallel })} />
                </div>
              </div>
              <div className='py-2 px-6 flex flex-col gap-1'>
                <label htmlFor="nameDescription" className='text-sm font-semibold text-white'>
                  Description:
                </label>
                <textarea className='bg-[#353535] text-white text-sm focus:outline-none focus:border-b border-[#6f62e8] w-full h-36 rounded-md' name="descriptionNode" onChange={(evt) => setNodeState({ ...nodeState, description: evt.target.value })} placeholder={selectedNode?.data['description']}></textarea>
              </div>
            </div>
          </>
        )
        }
        {selectedNode?.data.type !== 'Time' && selectedNode?.data.variables && (
          <>
            <div className='overflow-auto px-6 flex flex-col gap-2'>
              <h2 className='text-sm font-semibold text-white'>Variables</h2>
              <div key={JSON.stringify(myValue)}>
                <ReactJson
                  theme={'ocean'}
                  style={{ padding: 10, borderRadius: 10 }}
                  src={myValue}
                  name={null}
                  quotesOnKeys={false}
                  displayDataTypes={false}
                  enableClipboard={(e) => onClipboardCopy(e)}
                  onEdit={(edit) => {
                    setMyValue(edit.updated_src)
                    console.log('this is a edit', JSON.stringify(edit.updated_src))
                  }}
                  onAdd={() => {
                  }}
                  onDelete={(deleteobj) => {
                    setMyValue(deleteobj.updated_src)
                    console.log('this is a delete', JSON.stringify(deleteobj.updated_src))
                  }}
                />
              </div>
            </div>
          </>
        )}
        {
          selectedNode?.data.type === 'Time' && (
            <>
              <div className='w-[450px]'>
                <div className='py-2 px-6 flex flex-col gap-1'>
                  <label htmlFor="timeValue" className='text-sm font-semibold text-white'>
                    Time Value:
                  </label>
                  <input
                    type="number"
                    min="0"
                    className='bg-[#353535] text-white text-sm focus:outline-none focus:border-b border-[#6f62e8] w-full rounded-md h-8'
                    onChange={(evt) => handleTimeValueChange(parseFloat(evt.target.value))}
                    value={nodeState.timeData.value}
                  />
                </div>
                <div className='py-2 px-6 flex flex-col gap-1'>
                  <label htmlFor="timeUnits" className='text-sm font-semibold text-white'>
                    Time Units:
                  </label>
                  <select
                    className='bg-[#353535] text-white text-sm focus:outline-none focus:border-b border-[#6f62e8] w-full rounded-md h-8'
                    onChange={(evt) => handleTimeUnitsChange(evt.target.value)}
                    value={nodeState.timeData.units}
                  >
                    <option value='seconds'>Seconds</option>
                    <option value='minutes'>Minutes</option>
                    <option value='hours'>Hours</option>
                    <option value='days'>Days</option>
                  </select>
                </div>
              </div>
            </>
          )
        }
        {
          selectedNode?.data.type === 'Branch' && (
            <>
              <div className='w-[600px] overflow-auto'>
                <QueryBuilderPanel fields={fields} updateQuery={updateQuery} />
              </div>
            </>
          )
        }
        {
          selectedNode?.data.type !== 'Branch' ? (
            <div className='flex flex-col gap-2 py-2'>
              <button className='text-white bg-[#6f62e8] rounded-xl w-36 m-auto'>Update Node</button>
            </div>
          ) : (
            <div className='flex flex-col gap-2 py-2'>
              <button onClick={onAddClick} className='text-white bg-[#6f62e8] rounded-xl w-36 m-auto'>Add Query</button>
            </div>
          )
        }

      </form>
    </Modal>
  );
};

export default UpdateModal;
