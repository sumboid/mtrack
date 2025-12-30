import React from 'react';
import { Box, Typography, Tooltip } from './mui';
import type { MedicalHistoryRecord, MedicalRecordCategory } from '../models/medical.history.model';
import { CategoryDefs } from '../models/config';
import { useTranslation } from 'react-i18next';

interface MedicalTimelineProps {
  records: MedicalHistoryRecord[];
  getCategoryName: (category: MedicalRecordCategory) => string;
}

const TIMELINE_CONSTANTS = {
  ROW_HEIGHT: 40,
  POINT_SIZE: 12,
  BAR_HEIGHT: 24,
  LABEL_WIDTH: 120,
  LABEL_MARGIN: 16,
  AXIS_HEIGHT: 30,
  AXIS_PADDING: 60,
  SEGMENT_OPACITY: 0.05,
  GRID_LINE_OPACITY: 0.3,
  FOUR_MONTHS_MS: 123 * 24 * 60 * 60 * 1000,
  ONE_YEAR_MS: 365 * 24 * 60 * 60 * 1000,
  TWO_YEARS_MS: 730 * 24 * 60 * 60 * 1000,
} as const;

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_WEEK = 7 * MS_PER_DAY;

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const timeAxisStyle = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  height: TIMELINE_CONSTANTS.AXIS_HEIGHT,
  borderBottom: 1,
  borderColor: 'divider',
  zIndex: 2,
};

const gridLineStyle = {
  position: 'absolute' as const,
  top: 0,
  bottom: 0,
  width: '1px',
  bgcolor: 'divider',
  zIndex: 10,
  pointerEvents: 'none' as const,
};

const rowStyle = {
  position: 'absolute' as const,
  left: 0,
  right: 0,
  height: TIMELINE_CONSTANTS.ROW_HEIGHT,
  zIndex: 3,
};

const labelStyle = {
  position: 'absolute' as const,
  left: 0,
  top: TIMELINE_CONSTANTS.ROW_HEIGHT / 2,
  transform: 'translateY(-50%)',
  width: TIMELINE_CONSTANTS.LABEL_WIDTH,
  textAlign: 'right' as const,
  fontSize: '0.7rem',
  fontWeight: 500,
  zIndex: 2,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
};

const timelineBoxStyle = {
  mb: 3,
  bgcolor: 'background.paper',
  borderRadius: 2,
  p: 2,
};

const timelineTitleStyle = {
  mb: 2,
};

const segmentStyle = {
  position: 'absolute' as const,
  top: TIMELINE_CONSTANTS.AXIS_HEIGHT,
  bottom: 0,
  pointerEvents: 'none' as const,
  zIndex: 1,
};

const headerLabelStyle = {
  position: 'absolute' as const,
  top: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '0.75rem',
  fontWeight: 500,
};

const tooltipNotesStyle = {
  mt: 0.5,
};

export const MedicalTimeline: React.FC<MedicalTimelineProps> = React.memo(({ records, getCategoryName }) => {
  const { t } = useTranslation();

  const categoriesWithData = React.useMemo(
    () => [...new Set(records.map(record => record.category))].sort(),
    [records]
  );

  const { minDate, maxDate } = React.useMemo(() => {
    if (records.length === 0) {
      const now = new Date();
      return { minDate: now, maxDate: now };
    }

    const today = new Date();
    
    const { min, max } = records.reduce(
      (acc, record) => {
        let newMin = acc.min;
        let newMax = acc.max;
        
        if (record.date < newMin) newMin = record.date;
        if (record.date > newMax) newMax = record.date;
        
        if (record.type === 'continuous') {
          if (record.startDate && record.startDate < newMin) newMin = record.startDate;
          if (record.endDate && record.endDate > newMax) newMax = record.endDate;
          // If no endDate, event is ongoing - include today in range
          if (!record.endDate && record.startDate && today > newMax) newMax = today;
        }
        
        return { min: newMin, max: newMax };
      },
      { min: records[0].date, max: records[0].date }
    );

    // Round to start/end of months for cleaner boundaries
    const startOfMonth = new Date(min.getFullYear(), min.getMonth(), 1);
    const endDate = max > today ? today : max;
    
    const isCurrentMonth = endDate.getFullYear() === today.getFullYear() && 
                          endDate.getMonth() === today.getMonth();
    const finalMaxDate = isCurrentMonth ? today : new Date(endDate.getFullYear(), endDate.getMonth() + 1, 1);
    
    return {
      minDate: startOfMonth,
      maxDate: finalMaxDate,
    };
  }, [records]);

  console.log(minDate, maxDate)

  const dateToX = React.useCallback((date: Date, containerWidth: number): number => {
    const range = maxDate.getTime() - minDate.getTime();
    if (range === 0) return containerWidth / 2;
    const position = (date.getTime() - minDate.getTime()) / range;
    return position * containerWidth;
  }, [minDate, maxDate]);

  const formatDate = React.useCallback((date: Date): string => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dayStr = day < 10 ? `0${day}` : String(day);
    const monthStr = month < 10 ? `0${month}` : String(month);
    return `${dayStr}/${monthStr}/${year}`;
  }, []);

  const getChipStyle = React.useCallback((color: string) => ({
    bgcolor: `${color}.main`,
    color: `${color}.contrastText`,
    px: 1,
    py: 0.5,
    borderRadius: 1,
    fontSize: '0.7rem',
    fontWeight: 500,
  }), []);

  const getGridLinePosition = React.useCallback((left: number) => ({ left }), []);

  const getSegmentPosition = React.useCallback((left: number, width: number, bgcolor: string) => ({
    left,
    width,
    bgcolor,
  }), []);

  const getHeaderLabelPosition = React.useCallback((left: number) => ({
    left,
  }), []);

  const getRowPosition = React.useCallback((top: number) => ({ top }), []);

  const getBarStyle = React.useCallback((startX: number, width: number, color: string, isOngoing: boolean) => ({
    position: 'absolute' as const,
    left: startX,
    top: (TIMELINE_CONSTANTS.ROW_HEIGHT - TIMELINE_CONSTANTS.BAR_HEIGHT) / 2,
    width: Math.max(width, 4),
    height: TIMELINE_CONSTANTS.BAR_HEIGHT,
    bgcolor: `${color}.main`,
    borderRadius: 1,
    cursor: 'pointer',
    opacity: isOngoing ? 0.9 : 0.8,
    ...(isOngoing ? {
      borderRight: 3,
      borderRightColor: `${color}.light`,
      borderRightStyle: 'dashed',
    } : {}),
    '&:hover': {
      opacity: 1,
      transform: 'scaleY(1.1)',
    },
    transition: 'all 0.2s',
  }), []);

  const getPointStyle = React.useCallback((x: number, color: string) => ({
    position: 'absolute' as const,
    left: x - TIMELINE_CONSTANTS.POINT_SIZE / 2,
    top: (TIMELINE_CONSTANTS.ROW_HEIGHT - TIMELINE_CONSTANTS.POINT_SIZE) / 2,
    width: TIMELINE_CONSTANTS.POINT_SIZE,
    height: TIMELINE_CONSTANTS.POINT_SIZE,
    bgcolor: `${color}.main`,
    borderRadius: '50%',
    cursor: 'pointer',
    border: 2,
    borderColor: 'background.paper',
    '&:hover': {
      transform: 'scale(1.3)',
      zIndex: 10,
    },
    transition: 'all 0.2s',
  }), []);

  const rangeMs = React.useMemo(() => 
    maxDate.getTime() - minDate.getTime(), 
    [minDate, maxDate]
  );

  const showYearsInHeader = React.useMemo(() => 
    rangeMs >= TIMELINE_CONSTANTS.ONE_YEAR_MS,
    [rangeMs]
  );

  const segmentGranularity = React.useMemo((): 'weekly' | 'monthly' | 'yearly' => {
    const daysInRange = rangeMs / (24 * 60 * 60 * 1000);
    if (rangeMs <= TIMELINE_CONSTANTS.FOUR_MONTHS_MS) return 'weekly';
    if (rangeMs <= TIMELINE_CONSTANTS.TWO_YEARS_MS) return 'monthly';
    return 'yearly';
  }, [rangeMs]);

  console.log('Segment granularity:', segmentGranularity, 'Range days:', rangeMs / (24 * 60 * 60 * 1000));

  const headerLabels = React.useMemo(() => {
    const labels: Array<{ date: Date; label: string; startDate: Date; endDate: Date }> = [];
    
    if (showYearsInHeader) {
      for (let year = minDate.getFullYear(); year <= maxDate.getFullYear(); year++) {
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year + 1, 0, 1);
        const visibleStart = yearStart < minDate ? minDate : yearStart;
        const visibleEnd = yearEnd > maxDate ? maxDate : yearEnd;
        labels.push({
          date: yearStart,
          label: String(year),
          startDate: visibleStart,
          endDate: visibleEnd,
        });
      }
    } else {
      let current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
      while (current <= maxDate) {
        const monthStart = new Date(current);
        const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 1);
        const visibleStart = monthStart < minDate ? minDate : monthStart;
        const visibleEnd = monthEnd > maxDate ? maxDate : monthEnd;
        labels.push({
          date: new Date(current),
          label: `${MONTH_NAMES[current.getMonth()]} ${current.getFullYear()}`,
          startDate: visibleStart,
          endDate: visibleEnd,
        });
        current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
      }
    }
    
    return labels;
  }, [minDate, maxDate, showYearsInHeader]);

  const timeSegments = React.useMemo(() => {
    const segments: Array<{ start: Date; end: Date }> = [];
    
    if (segmentGranularity === 'weekly') {
      for (let current = new Date(minDate); current < maxDate; current = new Date(current.getTime() + MS_PER_WEEK)) {
        const weekEnd = new Date(current.getTime() + MS_PER_WEEK);
        segments.push({ start: new Date(current), end: weekEnd });
      }
    } else if (segmentGranularity === 'monthly') {
      let current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
      while (current < maxDate) {
        const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
        segments.push({ start: new Date(current), end: monthEnd });
        current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
      }
    } else {
      for (let year = minDate.getFullYear(); year <= maxDate.getFullYear(); year++) {
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31);
        segments.push({ start: yearStart, end: yearEnd });
      }
    }
    
    return segments;
  }, [minDate, maxDate, segmentGranularity]);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

  const totalHeight = categoriesWithData.length * TIMELINE_CONSTANTS.ROW_HEIGHT + TIMELINE_CONSTANTS.AXIS_PADDING;

  const containerStyle = React.useMemo(() => ({
    position: 'relative' as const,
    width: '100%',
    height: totalHeight,
    overflow: 'hidden' as const,
    p: '10px',
  }), [totalHeight]);

  React.useEffect(() => {
    if (!containerRef.current) return;
    
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth - TIMELINE_CONSTANTS.LABEL_WIDTH - TIMELINE_CONSTANTS.LABEL_MARGIN);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  if (records.length === 0) return null;

  return (
    <Box sx={timelineBoxStyle}>
      <Typography variant="h6" sx={timelineTitleStyle}>
        {t('patientDetails.timeline')}
      </Typography>
      
      <Box 
        ref={containerRef} 
        sx={containerStyle}
      >
        {/* Time segments (alternating backgrounds) */}
        {timeSegments.map((segment, idx) => {
          const startX = Math.max(
            TIMELINE_CONSTANTS.LABEL_WIDTH + TIMELINE_CONSTANTS.LABEL_MARGIN,
            dateToX(segment.start, containerWidth) + TIMELINE_CONSTANTS.LABEL_WIDTH + TIMELINE_CONSTANTS.LABEL_MARGIN
          );
          const endX = Math.min(
            containerRef.current?.offsetWidth || 0,
            dateToX(segment.end, containerWidth) + TIMELINE_CONSTANTS.LABEL_WIDTH + TIMELINE_CONSTANTS.LABEL_MARGIN
          );
          const width = endX - startX;
          
          if (width <= 0) return null;
          
          return (
            <Box
              key={`segment-${idx}`}
              sx={{
                ...segmentStyle,
                ...getSegmentPosition(startX, width, idx % 2 === 0 ? 'action.hover' : 'transparent'),
              }}
            />
          );
        })}
        
        {/* Time axis with header labels */}
        <Box sx={timeAxisStyle}>
          {headerLabels.map((header, idx) => {
            const startX = dateToX(header.startDate, containerWidth) + TIMELINE_CONSTANTS.LABEL_WIDTH + TIMELINE_CONSTANTS.LABEL_MARGIN;
            const endX = dateToX(header.endDate, containerWidth) + TIMELINE_CONSTANTS.LABEL_WIDTH + TIMELINE_CONSTANTS.LABEL_MARGIN;
            const centerX = (startX + endX) / 2;
            
            return (
              <Typography 
                key={`${header.label}-${idx}`}
                variant="caption" 
                sx={{
                  ...headerLabelStyle,
                  ...getHeaderLabelPosition(centerX),
                }}
              >
                {header.label}
              </Typography>
            );
          })}
        </Box>

        {/* Vertical grid lines for months/years */}
        {headerLabels.map((header, idx) => {
          if (idx === 0) return null;
          const startX = dateToX(header.startDate, containerWidth) + TIMELINE_CONSTANTS.LABEL_WIDTH + TIMELINE_CONSTANTS.LABEL_MARGIN;
          return (
            <Box key={`grid-${idx}`} sx={gridLineStyle} style={getGridLinePosition(startX)} />
          );
        })}

        {/* Timeline rows */}
        {categoriesWithData.map((category, idx) => {
          const categoryRecords = records.filter(r => r.category === category);
          const color = CategoryDefs[category].color || 'primary';
          const yOffset = TIMELINE_CONSTANTS.AXIS_HEIGHT + 10 + idx * TIMELINE_CONSTANTS.ROW_HEIGHT;

          return (
            <Box key={category} sx={rowStyle} style={getRowPosition(yOffset)}>
              {/* Category label */}
              <Box sx={labelStyle}>
                <Box sx={getChipStyle(color)}>
                  {getCategoryName(category)}
                </Box>
              </Box>



              {/* Records */}
              {categoryRecords.map(record => {
                if (record.type === 'continuous' && record.startDate) {
                  const today = new Date();
                  const isOngoing = !record.endDate;
                  const endDateToUse = isOngoing ? today : record.endDate!;
                  
                  const startX = dateToX(record.startDate, containerWidth) + TIMELINE_CONSTANTS.LABEL_WIDTH + TIMELINE_CONSTANTS.LABEL_MARGIN;
                  const endX = dateToX(endDateToUse, containerWidth) + TIMELINE_CONSTANTS.LABEL_WIDTH + TIMELINE_CONSTANTS.LABEL_MARGIN;
                  const width = endX - startX;

                  return (
                    <Tooltip
                      key={record.id}
                      title={
                        <Box>
                          <Typography variant="caption" display="block">
                            {getCategoryName(category)}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {formatDate(record.startDate)} - {isOngoing ? 'Ongoing' : formatDate(record.endDate!)}
                          </Typography>
                          {record.notes && (
                            <Typography variant="caption" display="block" sx={tooltipNotesStyle}>
                              {record.notes.substring(0, 100)}
                            </Typography>
                          )}
                        </Box>
                      }
                    >
                      <Box sx={getBarStyle(startX, width, color, isOngoing)} />
                    </Tooltip>
                  );
                } else {
                  // Point event
                  const x = dateToX(record.date, containerWidth) + TIMELINE_CONSTANTS.LABEL_WIDTH + TIMELINE_CONSTANTS.LABEL_MARGIN;

                  return (
                    <Tooltip
                      key={record.id}
                      title={
                        <Box>
                          <Typography variant="caption" display="block">
                            {getCategoryName(category)}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {formatDate(record.date)}
                          </Typography>
                          {record.notes && (
                            <Typography variant="caption" display="block" sx={tooltipNotesStyle}>
                              {record.notes.substring(0, 100)}
                            </Typography>
                          )}
                        </Box>
                      }
                    >
                      <Box sx={getPointStyle(x, color)} />
                    </Tooltip>
                  );
                }
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
});

MedicalTimeline.displayName = 'MedicalTimeline';
