import React, { useState, useRef, useEffect } from 'react'

import { Box, ClickAwayListener, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Popper, Stack, Typography, useTheme } from '@mui/material'

import PerfectScrollbar from 'react-perfect-scrollbar'

import MainCard from '../ui-components/MainCard'
import Transitions from '../ui-components/Transition'

import { AiFillMinusCircle, AiFillPlusCircle } from 'react-icons/ai'

import { StyledFab } from '../ui-components/StyledFab'
import 'react-perfect-scrollbar/dist/css/styles.css';

interface AddNodesProps {
    nodesData: any[];
}

const AddNodes: React.FC<AddNodesProps> = ({ nodesData }) => {
    const theme = useTheme()

    const [open, setOpen] = useState(false)

    const anchorRef = useRef(null)
    const prevOpen = useRef(open)
    const ps = useRef()

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return
        }
        setOpen(false)
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen)
    }

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeType));
        event.dataTransfer.effectAllowed = 'move';
    };

    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus()
        }

        prevOpen.current = open
    }, [open])
    return (
        <>
            <StyledFab
                sx={{ left: 20, top: 20 }}
                ref={anchorRef}
                size='small'
                color='primary'
                aria-label='add'
                title='Add Node'
                onClick={handleToggle}
            >
                {open ? <AiFillMinusCircle /> : <AiFillPlusCircle />}
            </StyledFab>
            <Popper
                placement='bottom-end'
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [-40, 14]
                            }
                        }
                    ]
                }}
                sx={{ zIndex: 1000 }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper elevation={16} >
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Box sx={{ px: 6, py: 4 }}>
                                        <Stack>
                                            <Typography variant='h5'>Add Nodes</Typography>
                                        </Stack>
                                        <Divider />
                                    </Box>
                                    <PerfectScrollbar
                                        containerRef={(el) => {
                                            ps.current = el
                                        }}
                                        style={{ height: '100%', maxHeight: 'calc(100vh - 320px)', overflowX: 'hidden' }}
                                    >
                                        <Box sx={{ p: 3 }}>
                                            <List
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 370,
                                                    py: 0,
                                                    borderRadius: '10px',

                                                    '& .MuiListItemSecondaryAction-root': {
                                                        top: 22
                                                    },
                                                    '& .MuiDivider-root': {
                                                        my: 0
                                                    },
                                                    '& .list-container': {
                                                        pl: 7
                                                    }
                                                }}
                                            >
                                                {nodesData.map((node, index) => (
                                                    <div key={node.name} onDragStart={(event) => onDragStart(event, node)} draggable>
                                                        <ListItemButton
                                                            sx={{
                                                                p: 0,
                                                                borderRadius: `5 px`,
                                                                cursor: 'move',
                                                            }}
                                                        >
                                                            <ListItem alignItems='center'>
                                                                <ListItemText sx={{ ml: 1 }} primary={node.label} secondary={node.descriptionNode} />
                                                            </ListItem>
                                                        </ListItemButton>
                                                        {index === nodesData.length - 1 ? null : <Divider />}
                                                    </div>
                                                ))}
                                            </List>
                                        </Box>
                                    </PerfectScrollbar>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    )
}

export default AddNodes
