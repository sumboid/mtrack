import { useCallback, useMemo } from 'react'
import { LinearProgress } from '@mui/material'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from './mui'
import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '../hooks/useIsMobile'
import type { ActorRefFrom } from 'xstate'
import type { backupMachine, BackupEvent } from '../fsm/backup.machine'

interface BackupDialogProps {
  open: boolean
  onClose: () => void
  backupState: { context: { importing: boolean; message: { type: 'success' | 'error'; text: string } | null } }
  backupSend: (event: BackupEvent) => void
}

const closeIconSx = { position: 'absolute', right: 8, top: 8 } as const
const alertSx = { mb: 2 } as const
const progressSx = { mb: 2 } as const
const buttonSx = { minWidth: 120 } as const

export const BackupDialog = ({ open, onClose, backupState, backupSend }: BackupDialogProps) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  const handleExport = useCallback(() => {
    backupSend({ type: 'EXPORT' })
  }, [backupSend])

  const handleImport = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = e.target instanceof HTMLInputElement ? e.target.files?.[0] : undefined
      if (!file) return
      backupSend({ type: 'IMPORT', file })
    }
    input.click()
  }, [backupSend])

  const handleCloseMessage = useCallback(() => backupSend({ type: 'DISMISS_MESSAGE' }), [backupSend])

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
      <Button variant="contained" onClick={handleImport} disabled={backupState.context.importing} sx={buttonSx}>
        {t('backup.import.button')}
      </Button>
    </ListItem>
  ), [t, handleImport, backupState.context.importing])

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
        {backupState.context.message && (
          <Alert severity={backupState.context.message.type} sx={alertSx} onClose={handleCloseMessage}>
            {t(backupState.context.message.text)}
          </Alert>
        )}

        {backupState.context.importing && <LinearProgress sx={progressSx} />}

        <List>
          {exportListItem}
          <Divider />
          {importListItem}
        </List>
      </DialogContent>
    </Dialog>
  )
}
