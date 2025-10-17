import React, { useMemo } from 'react';
import { Box, Typography, Chip, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { BreastCancer } from '../../models/diagnoses/breast.cancer';
import { calculateSubtype, calculateStage } from '../../wizard/models/breast.cancer.wizard.model';

const gridSpacing = 1;
const fullWidthGridSize = { xs: 12 };

interface BreastCancerDisplayProps {
  details: BreastCancer['details'];
}

export const BreastCancerDisplay: React.FC<BreastCancerDisplayProps> = React.memo(({ details }) => {
  const { t } = useTranslation();

  const stage = useMemo(() => 
    details.stage || calculateStage(details.tnmT, details.tnmN, details.tnmM),
    [details.stage, details.tnmT, details.tnmN, details.tnmM]
  );

  const subtype = useMemo(() => 
    details.subtype || calculateSubtype({
      er: details.er,
      pr: details.pr,
      her2: details.her2,
      ki67: details.ki67,
    }),
    [details.subtype, details.er, details.pr, details.her2, details.ki67]
  );

  return (
    <Box>
      <Grid container spacing={gridSpacing}>
        <Grid size={fullWidthGridSize}>
          <Typography variant="body2" component="span" color="text.secondary">
            {t('diagnosis.breastCancer.localization')}:{' '}
          </Typography>
          <Typography variant="body2" component="span">
            {t(`diagnosis.breastCancer.localization.${details.localization}`)}
          </Typography>
        </Grid>

        <Grid size={fullWidthGridSize}>
          <Typography variant="body2" component="span" color="text.secondary">
            {t('diagnosis.breastCancer.metastaticStatus')}:{' '}
          </Typography>
          <Typography variant="body2" component="span">
            {t(`diagnosis.breastCancer.metastaticStatus.${details.metastaticStatus}`)}
          </Typography>
        </Grid>

        <Grid size={fullWidthGridSize}>
          <Typography variant="body2" component="span" color="text.secondary">
            {t('diagnosis.breastCancer.tnm')}:{' '}
          </Typography>
          <Typography variant="body2" component="span">
            {details.tnmT} {details.tnmN} {details.tnmM}
          </Typography>
        </Grid>

        <Grid size={fullWidthGridSize}>
          <Typography variant="body2" component="span" color="text.secondary">
            {t('diagnosis.breastCancer.stage')}:{' '}
          </Typography>
          <Chip label={`Stage ${stage}`} size="small" color="primary" />
        </Grid>

        <Grid size={fullWidthGridSize}>
          <Typography variant="body2" component="span" color="text.secondary">
            {t('diagnosis.breastCancer.tumorType')}:{' '}
          </Typography>
          <Typography variant="body2" component="span">
            {details.tumorType === 'other' && details.tumorTypeOther
              ? details.tumorTypeOther
              : t(`diagnosis.breastCancer.tumorType.${details.tumorType.replace(/-/g, '')}`)}
          </Typography>
        </Grid>

        <Grid size={fullWidthGridSize}>
          <Typography variant="body2" component="span" color="text.secondary">
            {t('diagnosis.breastCancer.grade')}:{' '}
          </Typography>
          <Typography variant="body2" component="span">{details.grade}</Typography>
        </Grid>

        <Grid size={fullWidthGridSize}>
          <Typography variant="body2" component="span" color="text.secondary">
            {t('diagnosis.breastCancer.er')}:{' '}
          </Typography>
          <Typography variant="body2" component="span">
            {details.er === 'low' ? t('diagnosis.breastCancer.receptorStatus.low') : details.er}
          </Typography>
        </Grid>

        <Grid size={fullWidthGridSize}>
          <Typography variant="body2" component="span" color="text.secondary">
            {t('diagnosis.breastCancer.pr')}:{' '}
          </Typography>
          <Typography variant="body2" component="span">
            {details.pr === 'low' ? t('diagnosis.breastCancer.receptorStatus.low') : details.pr}
          </Typography>
        </Grid>

        <Grid size={fullWidthGridSize}>
          <Typography variant="body2" component="span" color="text.secondary">
            {t('diagnosis.breastCancer.her2')}:{' '}
          </Typography>
          <Typography variant="body2" component="span">{details.her2}</Typography>
        </Grid>

        {details.ki67 !== undefined && (
          <Grid size={fullWidthGridSize}>
            <Typography variant="body2" component="span" color="text.secondary">
              {t('diagnosis.breastCancer.ki67')}:{' '}
            </Typography>
            <Typography variant="body2" component="span">{details.ki67}%</Typography>
          </Grid>
        )}

        <Grid size={fullWidthGridSize}>
          <Typography variant="body2" component="span" color="text.secondary">
            {t('diagnosis.breastCancer.subtype')}:{' '}
          </Typography>
          <Chip 
            label={t(`diagnosis.breastCancer.subtype.${subtype.replace(/-/g, '')}`)} 
            size="small" 
            color="secondary" 
          />
        </Grid>
      </Grid>
    </Box>
  );
});

BreastCancerDisplay.displayName = 'BreastCancerDisplay';
