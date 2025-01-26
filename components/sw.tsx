'use client'

import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Snackbar, { type SnackbarCloseReason } from '@mui/material/Snackbar'
import {
  type MouseEvent as ReactMouseEvent,
  type SyntheticEvent,
  useEffect,
  useState
} from 'react'

export default function () {
  const [bc] = useState(new BroadcastChannel('sw'))
  const [open, setOpen] = useState(false)

  const action = (
    <>
      <Button color="secondary" onClick={onClick} size="small">
        Refresh
      </Button>
      <IconButton
        aria-label="close"
        color="inherit"
        onClick={handleClose}
        size="small">
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  )

  function onClick(_: ReactMouseEvent<HTMLButtonElement, MouseEvent>) {
    bc.postMessage('delete')
    bc.addEventListener(
      'message',
      (e) => {
        if (e.data === 'deleted') {
          location.reload()
        }
      },
      {
        once: true
      }
    )
    handleClose()
  }

  function handleClose(
    _?: Event | SyntheticEvent,
    reason?: SnackbarCloseReason
  ) {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
      navigator.serviceWorker.ready.then(() => bc.postMessage('load'))

      bc.addEventListener('message', (e) => {
        switch (e.data) {
          case 'error':
          case 'stale':
            setOpen(true)
            break
          default:
          // no-op
        }
      })
    }
  }, [bc])

  return (
    <Snackbar
      action={action}
      autoHideDuration={5000}
      message="Page updated"
      onClose={handleClose}
      open={open}
    />
  )
}
