import { FunctionComponent, memo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import useBranchModal from '../../../hooks/useBranchModal';

const ConditionalSubnode: FunctionComponent<NodeProps> = memo(({
  data,
  isConnectable,
}) => {

  const branchModal = useBranchModal();
  const openPropertiesModal = () => {
    branchModal.onOpen();
  };

  const handleDoubleClick = () => {
    openPropertiesModal();
  };

  return (
    <>
      <div
        className='text-xs text-center text-white'
        onDoubleClick={handleDoubleClick}
      >
        <Handle
          type="source"
          position={Position.Right}
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        />
        <h1 className='text-center text-base py-1 px-6 font-bold flex items-center gap-3'>
          {data?.query}
        </h1>
      </div>
    </>
  );
});

export default ConditionalSubnode;
