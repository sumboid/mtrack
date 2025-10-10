import React from 'react';
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { BreastCancer } from '../../models/diagnoses/breast.cancer';

const gridSpacing = 2;
const fullWidthGridSize = { xs: 12 };
const halfWidthGridSize = { xs: 12, sm: 6 };
const thirdWidthGridSize = { xs: 12, sm: 4 };
const gridContainerSx = { width: '100%', ml: 0 }; // Prevent negative margins overflow

interface BreastCancerFormProps {
  value: BreastCancer['details'];
  onChange: (value: BreastCancer['details']) => void;
  errors?: Partial<Record<keyof BreastCancer['details'], string>>;
}

export const BreastCancerForm: React.FC<BreastCancerFormProps> = ({
  value,
  onChange,
  errors = {},
}) => {
  const { t } = useTranslation();

  const handleChange = (field: keyof BreastCancer['details']) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }) => {
      onChange({
        ...value,
        [field]: e.target.value,
      });
    };

  const handleKi67Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange({
      ...value,
      ki67: val ? parseFloat(val) : undefined,
    });
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {t('diagnosis.breastCancer.details')}
      </Typography>
      
      <Grid container spacing={gridSpacing} sx={gridContainerSx}>
        <Grid size={halfWidthGridSize}>
          <FormControl fullWidth error={!!errors.localization}>
            <InputLabel>{t('diagnosis.breastCancer.localization')}</InputLabel>
            <Select
              value={value.localization || ''}
              onChange={handleChange('localization')}
              label={t('diagnosis.breastCancer.localization')}
            >
              <MenuItem value="left">{t('diagnosis.breastCancer.localization.left')}</MenuItem>
              <MenuItem value="right">{t('diagnosis.breastCancer.localization.right')}</MenuItem>
              <MenuItem value="both">{t('diagnosis.breastCancer.localization.both')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={halfWidthGridSize}>
          <FormControl fullWidth error={!!errors.metastaticStatus}>
            <InputLabel>{t('diagnosis.breastCancer.metastaticStatus')}</InputLabel>
            <Select
              value={value.metastaticStatus || ''}
              onChange={handleChange('metastaticStatus')}
              label={t('diagnosis.breastCancer.metastaticStatus')}
            >
              <MenuItem value="early">{t('diagnosis.breastCancer.metastaticStatus.early')}</MenuItem>
              <MenuItem value="metastatic">{t('diagnosis.breastCancer.metastaticStatus.metastatic')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={fullWidthGridSize}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t('diagnosis.breastCancer.tnm')}
          </Typography>
        </Grid>

        <Grid size={thirdWidthGridSize}>
          <FormControl fullWidth error={!!errors.tnmT}>
            <InputLabel>{t('diagnosis.breastCancer.tnmT')}</InputLabel>
            <Select
              value={value.tnmT || ''}
              onChange={handleChange('tnmT')}
              label={t('diagnosis.breastCancer.tnmT')}
            >
              {['T0', 'Tis', 'T1', 'T1a', 'T1b', 'T1c', 'T2', 'T3', 'T4', 'T4a', 'T4b', 'T4c', 'T4d'].map(t => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={thirdWidthGridSize}>
          <FormControl fullWidth error={!!errors.tnmN}>
            <InputLabel>{t('diagnosis.breastCancer.tnmN')}</InputLabel>
            <Select
              value={value.tnmN || ''}
              onChange={handleChange('tnmN')}
              label={t('diagnosis.breastCancer.tnmN')}
            >
              {['N0', 'N1', 'N1a', 'N1b', 'N1c', 'N2', 'N2a', 'N2b', 'N3', 'N3a', 'N3b', 'N3c'].map(n => (
                <MenuItem key={n} value={n}>{n}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={thirdWidthGridSize}>
          <FormControl fullWidth error={!!errors.tnmM}>
            <InputLabel>{t('diagnosis.breastCancer.tnmM')}</InputLabel>
            <Select
              value={value.tnmM || ''}
              onChange={handleChange('tnmM')}
              label={t('diagnosis.breastCancer.tnmM')}
            >
              <MenuItem value="M0">M0</MenuItem>
              <MenuItem value="M1">M1</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={fullWidthGridSize}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t('diagnosis.breastCancer.tumor')}
          </Typography>
        </Grid>

        <Grid size={halfWidthGridSize}>
          <FormControl fullWidth error={!!errors.tumorType}>
            <InputLabel>{t('diagnosis.breastCancer.tumorType')}</InputLabel>
            <Select
              value={value.tumorType || ''}
              onChange={handleChange('tumorType')}
              label={t('diagnosis.breastCancer.tumorType')}
            >
              <MenuItem value="invasive-nst">{t('diagnosis.breastCancer.tumorType.invasiveNst')}</MenuItem>
              <MenuItem value="lobular">{t('diagnosis.breastCancer.tumorType.lobular')}</MenuItem>
              <MenuItem value="other">{t('diagnosis.breastCancer.tumorType.other')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {value.tumorType === 'other' && (
          <Grid size={halfWidthGridSize}>
            <TextField
              fullWidth
              label={t('diagnosis.breastCancer.tumorTypeOther')}
              value={value.tumorTypeOther || ''}
              onChange={handleChange('tumorTypeOther')}
            />
          </Grid>
        )}

        <Grid size={thirdWidthGridSize}>
          <FormControl fullWidth error={!!errors.grade}>
            <InputLabel>{t('diagnosis.breastCancer.grade')}</InputLabel>
            <Select
              value={value.grade || ''}
              onChange={handleChange('grade')}
              label={t('diagnosis.breastCancer.grade')}
            >
              <MenuItem value="G1">G1</MenuItem>
              <MenuItem value="G2">G2</MenuItem>
              <MenuItem value="G3">G3</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={fullWidthGridSize}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t('diagnosis.breastCancer.biomarkers')}
          </Typography>
        </Grid>

        <Grid size={thirdWidthGridSize}>
          <FormControl fullWidth error={!!errors.er}>
            <InputLabel>{t('diagnosis.breastCancer.er')}</InputLabel>
            <Select
              value={value.er || ''}
              onChange={handleChange('er')}
              label={t('diagnosis.breastCancer.er')}
            >
              <MenuItem value="0">0</MenuItem>
              <MenuItem value="low">{t('diagnosis.breastCancer.receptorStatus.low')}</MenuItem>
              <MenuItem value="+">+</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={thirdWidthGridSize}>
          <FormControl fullWidth error={!!errors.pr}>
            <InputLabel>{t('diagnosis.breastCancer.pr')}</InputLabel>
            <Select
              value={value.pr || ''}
              onChange={handleChange('pr')}
              label={t('diagnosis.breastCancer.pr')}
            >
              <MenuItem value="0">0</MenuItem>
              <MenuItem value="low">{t('diagnosis.breastCancer.receptorStatus.low')}</MenuItem>
              <MenuItem value="+">+</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={thirdWidthGridSize}>
          <FormControl fullWidth error={!!errors.her2}>
            <InputLabel>{t('diagnosis.breastCancer.her2')}</InputLabel>
            <Select
              value={value.her2 || ''}
              onChange={handleChange('her2')}
              label={t('diagnosis.breastCancer.her2')}
            >
              <MenuItem value="0">0</MenuItem>
              <MenuItem value="low">{t('diagnosis.breastCancer.receptorStatus.low')}</MenuItem>
              <MenuItem value="+">+</MenuItem>
              <MenuItem value="IHC2+FISH+">IHC 2+ FISH+</MenuItem>
              <MenuItem value="IHC2+FISH-">IHC 2+ FISH-</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={halfWidthGridSize}>
          <TextField
            fullWidth
            type="number"
            label={t('diagnosis.breastCancer.ki67')}
            value={value.ki67 ?? ''}
            onChange={handleKi67Change}
            inputProps={{ min: 0, max: 100, step: 0.1 }}
            error={!!errors.ki67}
            helperText={errors.ki67}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
