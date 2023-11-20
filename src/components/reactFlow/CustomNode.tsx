import { FunctionComponent, memo, useState } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import MainCard from '../ui-components/MainCard'
import { Box, Button, Divider, IconButton, Tooltip, Typography, styled, tooltipClasses } from '@mui/material'
import useUpdateModal from '../../hooks/useUpdateModal'
import useStore from '../../store/store'
import { IoMdCopy } from 'react-icons/io'
import { queryType } from '../../utils/types'

const CardWrapper = styled(MainCard)(() => ({
  background: '#fff',
  color: '#000',
  border: 'solid 1px',
  borderRadius: '15px',
  borderColor: '#AEDFF7',
  width: '300px',
  height: 'auto',
  padding: '10px',
  boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)',
  '&:hover': {
    borderColor: '#C5AEDF'
  }
}))

const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#A3A8E4',
    color: '#111',
    boxShadow: '#666'
  }
}))

const CustomNode: FunctionComponent<NodeProps> = memo(({ data, isConnectable }) => {
  const [open, setOpen] = useState(false)
  const updateModal = useUpdateModal()
  const { duplicateNode } = useStore()

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }
  const openUpdateModal = () => {
    updateModal.onOpen()
  }
  const onDialogClicked = () => {
    openUpdateModal()
  }

  return (
    <>
      <CardWrapper
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        content={false}
        border={false}
      >
        <LightTooltip
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          disableFocusListener={true}
          title={
            <div
              style={{
                background: 'transparent',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <IconButton
                title='Duplicate'
                onClick={() => {
                  duplicateNode(data.id)
                }}
                sx={{ height: '35px', width: '35px', '&:hover': { color: '#12345f' } }}
              >
                <IoMdCopy />
              </IconButton>
            </div>
          }
          placement='right-start'
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>

              <Box
                sx={{
                  padding: 1.5,
                  width: '100%'
                }}
              >
                <Typography
                  variant='h2'
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 500,
                    textAlign: 'center',
                  }}
                >
                  {data.label}
                </Typography>
              </Box>
            </div>
            {data?.description && data?.description?.length !== 0 && (
              <>
                <Divider />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    paddingY: 1
                  }}
                >
                  <Typography
                    variant='h3'
                    sx={{
                      fontSize: 16,
                      fontWeight: 500,
                      paddingLeft: 1
                    }}
                  >
                    Description:
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{
                      paddingX: 1,
                      fontSize: 12
                    }}
                  >
                    {data?.description}
                  </Typography>
                </Box>
              </>
            )}
            {data?.variables && Object.keys(data?.variables).length > 0 && (
              <>
                <Divider />
                <Box
                  sx={{
                    textAlign: 'left',
                    width: '100%',
                    paddingLeft: 1
                  }}
                >
                  <Typography
                    variant='h2'
                    sx={{
                      fontSize: 16,
                      fontWeight: 500,

                    }}
                  >
                    Variables:
                  </Typography>
                  <Divider />
                  <ul>
                    {Object.entries(data.variables).map(([key, value], index) => (
                      <li key={index}>
                        <strong>{key}:</strong> {JSON.stringify(value)}
                      </li>
                    ))}
                  </ul>
                </Box>
              </>
            )}
            {data?.type === 'Time' && data?.timeData && Object.keys(data.timeData).length !== 0 && (
              <>
                <Divider />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    paddingY: 1
                  }}
                >
                  <Typography
                    variant='body1'
                    sx={{
                      paddingX: 1,
                      fontSize: 12
                    }}
                  >
                    Action in progress after:{data?.timeData.value} - {data?.timeData.units}
                  </Typography>
                  <Divider />

                </Box>
              </>
            )}
            {data.type === 'Branch' && (
              <>
                <Handle
                  type="target"
                  position={Position.Left}
                  onConnect={(params) => console.log('handle onConnect', params)}
                  isConnectable={isConnectable}
                />
                {data.queryData && data.queryData.map((queryItem: queryType) => (
                  <div key={queryItem.id} className='border rounded-lg flex items-center justify-center px-3 min-h-[40px] w-[200px] '>
                    <div className='max-w-[200px] break-words px-2'>{queryItem.query}</div>
                    <Handle
                      type="source"
                      position={Position.Right}
                      style={{ top: 'auto', background: '#555' }}
                      id={queryItem.id}
                      isConnectable={isConnectable}
                    />
                  </div>
                ))}
                <Handle
                  type="source"
                  position={Position.Bottom}
                  id='b'
                  isConnectable={isConnectable}
                />
              </>
            )}
            {data.type === 'SendMail' && (
              <>
                <Divider />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 1,
                    paddingY: 1,
                    width: '100%'
                  }}
                >
                  <Typography
                    variant='body1'
                    sx={{
                      paddingX: 1,
                      fontSize: 12
                    }}
                  >
                    <span>To:</span>{data?.mailData.to}
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{
                      paddingX: 1,
                      fontSize: 12
                    }}
                  >
                    <span>Subject:</span>{data?.mailData.subject}
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{
                      paddingX: 1,
                      fontSize: 12
                    }}
                  >
                    <span>body:</span>{data?.mailData.html}
                  </Typography>
                </Box>
              </>
            )}

            {
              data.type === 'Branch' && (
                <>
                  <Button sx={{ borderRadius: 25, width: '75%', marginY: '1rem', fontSize: '12px' }} variant='outlined' onClick={onDialogClicked}>
                    Add Condition
                  </Button>
                </>
              )
            }
            {
              data.type === 'SendMail' && (
                <>
                  <Button sx={{ borderRadius: 25, width: '75%', marginY: '1rem', fontSize: '12px' }} variant='outlined' onClick={onDialogClicked}>
                    Add Mail Properties
                  </Button>
                </>
              )
            }
            {(data.type !== 'Branch' && data.type !== 'SendMail') && (<>
              <Button sx={{ borderRadius: 25, width: '75%', marginY: '1rem', fontSize: '12px' }} variant='outlined' onClick={onDialogClicked}>
                Additional Parameters
              </Button>
            </>)
            }
          </Box>
        </LightTooltip>
      </CardWrapper>
      {data.type === 'Input' && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            onConnect={(params) => console.log('handle onConnect', params)}
            isConnectable={isConnectable}
          />
        </>
      )}
      {(data.type !== 'Input' && data.type !== 'Branch') && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            onConnect={(params) => console.log('handle onConnect', params)}
            isConnectable={isConnectable}
          />
          <Handle
            type="target"
            position={Position.Left}
            onConnect={(params) => console.log('handle onConnect', params)}
            isConnectable={isConnectable}
          />
        </>
      )}

    </>
  )
})

export default CustomNode
