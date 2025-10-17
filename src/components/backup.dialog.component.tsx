import { useState, useCallback, useMemo } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  LinearProgress,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '../hooks/useIsMobile'
import {
  exportDataToJSON,
  importDataFromJSON,
  downloadBackup
} from '../services/backup.service'

interface BackupDialogProps {
  open: boolean
  onClose: () => void
}

const closeIconSx = { position: 'absolute', right: 8, top: 8 } as const
const alertSx = { mb: 2 } as const
const progressSx = { mb: 2 } as const
const buttonSx = { minWidth: 120 } as const

export const BackupDialog = ({ open, onClose }: BackupDialogProps) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [importing, setImporting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleExport = useCallback(async () => {
    try {
      const jsonData = await exportDataToJSON()
      downloadBackup(jsonData)
      setMessage({ type: 'success', text: t('backup.export.success') })
    } catch (error) {
      setMessage({ type: 'error', text: t('backup.export.errorFailed') })
    }
  }, [t])

  const handleImport = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      setImporting(true)
      try {
        const text = await file.text()
        const result = await importDataFromJSON(text)
        
        if (result.success) {
          setMessage({ type: 'success', text: t('backup.import.success') })
        } else {
          setMessage({ type: 'error', text: result.error || t('backup.import.errorFailed') })
        }
      } catch (error) {
        setMessage({ type: 'error', text: t('backup.import.errorRead') })
      } finally {
        setImporting(false)
      }
    }
    input.click()
  }, [t])

  const handleCloseMessage = useCallback(() => setMessage(null), [])

  // Memoize list items to prevent re-renders
  const exportListItem = useMemo(() => (
    <ListItem>
      <ListItemIcon>
        <DownloadIcon />
      </ListItemIcon>
      <ListItemText
        primary={t('backup.export.title')}
        secondary={t('backup.export.description')}
      />
      <Button variant="contained" onClick={handleExport} sx={buttonSx}>
        {t('backup.export.button')}
      </Button>
    </ListItem>
  ), [t, handleExport])

  const importListItem = useMemo(() => (
    <ListItem>
      <ListItemIcon>
        <UploadIcon />
      </ListItemIcon>
      <ListItemText
        primary={t('backup.import.title')}
        secondary={t('backup.import.description')}
      />
      <Button variant="contained" onClick={handleImport} disabled={importing} sx={buttonSx}>
        {t('backup.import.button')}
      </Button>
    </ListItem>
  ), [t, handleImport, importing])

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>
        {t('backup.title')}
        <IconButton onClick={onClose} sx={closeIconSx}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        {message && (
          <Alert severity={message.type} sx={alertSx} onClose={handleCloseMessage}>
            {message.text}
          </Alert>
        )}

        {importing && <LinearProgress sx={progressSx} />}

        <List>
          {exportListItem}
          <Divider />
          {importListItem}
        </List>
      </DialogContent>
    </Dialog>
  )
}
