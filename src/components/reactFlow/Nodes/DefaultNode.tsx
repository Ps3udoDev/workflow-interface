
import { FunctionComponent, memo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import useDefaultModal from '../../../hooks/useDefaultModal';

type VariableNode = {
  name: string
  value: undefined
}

const DefaultNode: FunctionComponent<NodeProps> = memo(({ data, isConnectable }) => {
  const defaultModal = useDefaultModal();

  const openInputModal = () => {
    defaultModal.onOpen();
  }

  const handleDoubleClick = () => {
    openInputModal()
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
        {data?.variables && data?.variables.length > 0 && (
          <div className='border-t border-gray-600 w-full h-full px-6 text-left'>
            <h2 className='text-sm font-bold'>Variables:</h2>
            <ul className='text-xs font-thin '>
              {(data.variables).map((variable: VariableNode, index: number) => (
                <li key={index}>
                  <strong>{variable.name}:</strong> {JSON.stringify(variable.value)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
    </>
  )
})

export default DefaultNode;