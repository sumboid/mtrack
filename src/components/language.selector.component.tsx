import React, { useCallback, useMemo } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = React.memo(() => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = useCallback((event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
  }, [i18n]);

  const languages = useMemo(() => [
    { code: 'en', label: t('languageSelector.english') },
    { code: 'hy', label: t('languageSelector.armenian') },
    { code: 'ka', label: t('languageSelector.georgian') },
    { code: 'de', label: t('languageSelector.german') },
    { code: 'ru', label: t('languageSelector.russian') }
  ], [t]);

  // Normalize the current language to base code (e.g., 'en-US' -> 'en')
  const currentLanguage = useMemo(() => i18n.language.split('-')[0], [i18n.language]);

  return (
    <FormControl 
      size="small" 
      sx={{ 
        minWidth: 120,
      }}
    >
      <InputLabel 
        id="language-selector-label"
        sx={{
          color: 'text.secondary',
          '&.Mui-focused': {
            color: 'primary.main',
          },
        }}
      >
        {t('languageSelector.label')}
      </InputLabel>
      <Select
        labelId="language-selector-label"
        id="language-selector"
        value={currentLanguage}
        label={t('languageSelector.label')}
        onChange={handleLanguageChange}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            {lang.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

LanguageSelector.displayName = 'LanguageSelector';

export default LanguageSelector;
