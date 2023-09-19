import { FunctionComponent, memo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import useOutputModal from '../../../hooks/useOutputModal';

const OutputNode: FunctionComponent<NodeProps> = memo(({ data, isConnectable }) => {
  const outputModal = useOutputModal();

  const openOutputModal = () => {
    outputModal.onOpen();
  }

  const handleDoubleClick = () => {
    openOutputModal()
  }
  return (
    <>
    <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div
        className='rounded-md text-xs text-center text-white'
        onDoubleClick={handleDoubleClick}
      >
        <h1 className='text-center text-base py-3 px-6 font-bold flex items-center gap-3'>
          {data?.label}
        </h1>
        {data?.description.length !== 0 ? (
          <div className='border-t border-gray-600 px-3'>
            <h2>Description:</h2>
            <p className='max-w-[120px] break-words'>{data?.description}</p>
          </div>
        ) : null}
      </div>
    </>
  )
})

export default OutputNode;