import { useMediaQuery, useTheme } from '@mui/material'

/**
 * Hook to determine if the current screen is mobile/tablet size
 * Used for responsive layouts (fullscreen dialogs, card vs table view, etc.)
 */
export function useIsMobile() {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.down('md'))
}
