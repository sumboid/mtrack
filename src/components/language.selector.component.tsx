import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
  };

  const languages = [
    { code: 'en', label: t('languageSelector.english') },
    { code: 'es', label: t('languageSelector.spanish') },
    { code: 'de', label: t('languageSelector.german') },
    { code: 'ru', label: t('languageSelector.russian') }
  ];

  // Normalize the current language to base code (e.g., 'en-US' -> 'en')
  const currentLanguage = i18n.language.split('-')[0];

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
};

export default LanguageSelector;
