'use client'

import { type MouseEvent as ReactMouseEvent, useEffect, useState } from 'react'

export default function () {
  const [bc] = useState(new BroadcastChannel('sw'))
  const [cacheFreshness, setCacheFreshness] = useState(true)

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
  }

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
      navigator.serviceWorker.ready.then(() => bc.postMessage('load'))

      bc.addEventListener('message', (e) => {
        switch (e.data) {
          case 'error':
          case 'stale':
            setCacheFreshness(false)
            break
          default:
          // no-op
        }
      })
    }
  }, [bc])

  return (
    <>
      {!cacheFreshness && (
        <button onClick={onClick} type="button">
          Refresh page
        </button>
      )}
    </>
  )
}
