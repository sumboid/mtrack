import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from '@xstate/react';
import type { ActorRefFrom } from 'xstate';
import type { BreastCancer } from '../../models/diagnoses/breast.cancer';
import { type BreastCancerFormMachine } from '../../fsm/breast.cancer.form.machine';
import { TextField, Grid, FormControl, InputLabel, Select, MenuItem, Typography, Box } from '../mui';

const gridSpacing = 2;
const fullWidthGridSize = { xs: 12 };
const halfWidthGridSize = { xs: 12, sm: 6 };
const thirdWidthGridSize = { xs: 12, sm: 4 };
const gridContainerSx = { width: '100%', ml: 0 }; // Prevent negative margins overflow

interface BreastCancerFormProps {
  actorRef: ActorRefFrom<BreastCancerFormMachine>;
}

export const BreastCancerForm: React.FC<BreastCancerFormProps> = React.memo(({
  actorRef,
}) => {
  const { t } = useTranslation();
  const value = useSelector(actorRef, (snapshot) => snapshot.context);

  const handleChange = useCallback((field: keyof BreastCancer['details']) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }) => {
      actorRef.send({ type: 'CHANGE', field, value: e.target.value as string | number | undefined });
    }, [actorRef]);

  const handleKi67Change = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    actorRef.send({ 
      type: 'CHANGE_KI67', 
      value: val ? parseFloat(val) : undefined,
    });
  }, [actorRef]);

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {t('diagnosis.breastCancer.details')}
      </Typography>
      
      <Grid container spacing={gridSpacing} sx={gridContainerSx}>
        <Grid size={halfWidthGridSize}>
          <FormControl fullWidth>
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
          <FormControl fullWidth>
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
          <FormControl fullWidth>
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
          <FormControl fullWidth>
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
          <FormControl fullWidth>
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
          <FormControl fullWidth>
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
          <FormControl fullWidth>
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
          <FormControl fullWidth>
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
          <FormControl fullWidth>
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
          <FormControl fullWidth>
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
          />
        </Grid>
      </Grid>
    </Box>
  );
});

BreastCancerForm.displayName = 'BreastCancerForm';
