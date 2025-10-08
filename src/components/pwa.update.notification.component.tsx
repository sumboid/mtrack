import { useState, useEffect } from 'react'
import { Snackbar, Button, Alert } from '@mui/material'
import { useRegisterSW } from 'virtual:pwa-register/react'

export function PWAUpdateNotification() {
  const [showReload, setShowReload] = useState(false)
  
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      if (registration) {
        setInterval(() => {
          registration.update()
        }, 60 * 60 * 1000)
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error)
    },
  })

  useEffect(() => {
    if (needRefresh) {
      setShowReload(true)
    }
  }, [needRefresh])

  const handleClose = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
    setShowReload(false)
  }

  const handleUpdate = () => {
    updateServiceWorker(true)
  }

  return (
    <>
      <Snackbar
        open={offlineReady}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          App is ready to work offline!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showReload}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={handleUpdate}>
              Update
            </Button>
          }
          sx={{ width: '100%' }}
        >
          New version available! Click Update to refresh.
        </Alert>
      </Snackbar>
    </>
  )
}
