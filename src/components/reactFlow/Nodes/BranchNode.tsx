import { FunctionComponent, memo } from 'react';
import { Handle, NodeProps, NodeResizer, Position } from 'reactflow';
import useBranchModal from '../../../hooks/useBranchModal';
import { queryType } from '../../../utils/types';


const BranchNode: FunctionComponent<NodeProps> = memo(({ data, isConnectable, selected }) => {
  const branchModal = useBranchModal();

  const openBranchModal = () => {
    branchModal.onOpen();
  };

  const handleDoubleClick = () => {
    openBranchModal();
  };

  return (
    <>
      <div
        className='rounded-md text-xs text-center text-white'
        onDoubleClick={handleDoubleClick}
      >
        <Handle
          type="target"
          position={Position.Top}
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        />
        <h1 className='text-center text-base py-3 px-6 font-bold flex items-center gap-3'>
          {data?.label}
        </h1>
        <div className='flex flex-col gap-1'>
          {data?.query && data.query.map((queryItem: queryType) => (
            <div key={queryItem.id} className='border-y rounded-lg flex items-center justify-center px-1 min-h-[40px]'>
              <div className='max-w-[200px] break-words '>{queryItem.query}</div>
              <Handle
                type="source"
                position={Position.Right}
                style={{ top: 'auto', background: '#555' }}
                id={queryItem.id}
                onConnect={(params) => console.log('handle onConnect', params)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
});

export default BranchNode;
