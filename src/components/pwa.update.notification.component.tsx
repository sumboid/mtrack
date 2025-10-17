import { useState, useEffect, useCallback, useMemo } from 'react'
import { Snackbar, Button, Alert } from '@mui/material'
import { useRegisterSW } from 'virtual:pwa-register/react'

const anchorOrigin = { vertical: 'bottom', horizontal: 'center' } as const
const alertSx = { width: '100%' } as const

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

  const handleClose = useCallback(() => {
    setOfflineReady(false)
    setNeedRefresh(false)
    setShowReload(false)
  }, [setOfflineReady, setNeedRefresh])

  const handleUpdate = useCallback(() => {
    updateServiceWorker(true)
  }, [updateServiceWorker])

  const updateButton = useMemo(() => (
    <Button color="inherit" size="small" onClick={handleUpdate}>
      Update
    </Button>
  ), [handleUpdate])

  return (
    <>
      <Snackbar
        open={offlineReady}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
      >
        <Alert onClose={handleClose} severity="success" sx={alertSx}>
          App is ready to work offline!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showReload}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
      >
        <Alert
          onClose={handleClose}
          severity="info"
          action={updateButton}
          sx={alertSx}
        >
          New version available! Click Update to refresh.
        </Alert>
      </Snackbar>
    </>
  )
}
