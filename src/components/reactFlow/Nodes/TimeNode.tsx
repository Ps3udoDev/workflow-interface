import { FunctionComponent, memo, useState, useEffect } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import useTimeModal from '../../../hooks/useTimeModal';


const TimeNode: FunctionComponent<NodeProps> = memo(({ data, isConnectable }) => {
  const timeModal = useTimeModal();
  const openTimeModal = () => {
    timeModal.onOpen();
  };

  /* const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    if (data?.time && data.time.milliseconds > 0) {
      setTimeRemaining(data.time.milliseconds);
      setIsCounting(true);
    } else {
      setTimeRemaining(0);
      setIsCounting(false);
    }
  }, [data?.time]);

  useEffect(() => {
    if (timeModal.isOpen && timeModal.data?.time?.milliseconds > 0) {
      setTimeRemaining(timeModal.data.time.milliseconds);
      setIsCounting(true);
    }
  }, [timeModal.isOpen, timeModal.data]);

  useEffect(() => {
    if (isCounting && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1000);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isCounting, timeRemaining]);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    const pad = (value: number) => (value < 10 ? `0${value}` : `${value}`);

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }; */

  const handleDoubleClick = () => {
    openTimeModal();
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
        {/* {data?.time && data?.time.units ? (
          <div className='border-t border-gray-600 text-lg py-2'>
            <p className='max-w-[120px] break-words'>{formatTime(timeRemaining)}</p>
          </div>
        ) : null} */}
        {data?.time && Object.keys(data.time).length !== 0 ? (
          <div className='border-t border-gray-600 text-sm py-2'>
            <p><span className='font-bold'>units: </span>{data.time.units}</p>
            <p><span className='font-bold'>value: </span>{data.time.value}</p>
          </div>
        ) : null}

      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
    </>
  );
});

export default TimeNode;
