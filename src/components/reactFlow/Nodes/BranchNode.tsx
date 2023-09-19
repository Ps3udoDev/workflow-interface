import { FunctionComponent, memo } from 'react';
import { Handle, NodeProps, NodeResizer, Position } from 'reactflow';
import useBranchModal from '../../../hooks/useBranchModal';


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
      <NodeResizer color="#6f62e8af" isVisible={selected} minWidth={100} minHeight={20} />
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
      </div>
    </>
  );
});

export default BranchNode;
