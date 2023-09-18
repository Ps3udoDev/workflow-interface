import React from 'react'
import { FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight, FaCodeBranch } from 'react-icons/fa'
import { BiSolidTimeFive } from 'react-icons/bi'

const PanelTypes = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <aside className='w-[230px] h-[300px] m-auto flex flex-col items-center overflow-hidden '>
      <h2 className="text-center text-white font-bold my-1 text-lg">Nodes</h2>
      <hr className="border-t-2 border-[#6f62e8] my-3 w-4/5" />
      <div className='grid grid-cols-2 gap-2 p-3'>
        <div className="h-16 p-1 border border-solid border-[#6f62e8] rounded-lg flex justify-center items-center cursor-grab gap-2" onDragStart={(event) => onDragStart(event, 'inputNode')} draggable>
          <p className="text-xs text-center text-white">Input Node</p>
           <FaArrowAltCircleRight className="text-xl text-[#40E0D0]"  />
        </div>
        <div className="h-16 p-1 border border-solid border-[#6f62e8] rounded-lg flex justify-center items-center cursor-grab gap-2" onDragStart={(event) => onDragStart(event, 'defaultNode')} draggable>
          <p className="text-xs text-center text-white">Default Node</p> 
          <FaArrowAltCircleDown className="text-xl text-[#C0C0C0]"  />
        </div>
        <div className="h-16 p-1 border border-solid border-[#6f62e8] rounded-lg flex justify-center items-center cursor-grab gap-2" onDragStart={(event) => onDragStart(event, 'outputNode')} draggable>
          <p className="text-xs text-center text-white">Output Node</p> 
          <FaArrowAltCircleLeft className="text-xl text-[#9370DB]"  />
        </div>
        <div className="h-16 p-1 border border-solid border-[#6f62e8] rounded-lg flex justify-center items-center cursor-grab gap-2" onDragStart={(event) => onDragStart(event, 'branchNode')} draggable>
          <p className="text-xs text-center text-white">Branch Node</p>
           <FaCodeBranch className="text-xl text-[#FFA500]"  />
        </div>
        <div className="h-16 p-1 border border-solid border-[#6f62e8] rounded-lg flex  justify-center items-center cursor-grab gap-2" onDragStart={(event) => onDragStart(event, 'timeNode')} draggable>
          <p className="text-xs text-center text-white">Time Node</p>
           <BiSolidTimeFive className="text-xl text-[#90EE90]"  />
        </div>
      </div>
    </aside>
  )
}

export default PanelTypes