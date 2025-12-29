import React from 'react';
import type { ActorRefFrom } from 'xstate';
import { BreastCancerForm } from './breast.cancer.form.component';
import { BreastCancerDisplay } from './breast.cancer.display.component';
import type { BreastCancer } from '../../models/diagnoses/breast.cancer';
import { createBreastCancerFormMachine } from '../../fsm/breast.cancer.form.machine';

export type DiagnosisType = 'breast-cancer';

export type DiagnosisDetails = BreastCancer['details'];

interface DiagnosisFormFactoryProps {
  type: DiagnosisType;
  breastCancerFormRef?: ActorRefFrom<ReturnType<typeof createBreastCancerFormMachine>>;
}

export const DiagnosisFormFactory: React.FC<DiagnosisFormFactoryProps> = React.memo(({
  type,
  breastCancerFormRef,
}) => {
  if (!breastCancerFormRef) return null;
  
  switch (type) {
    case 'breast-cancer':
      return <BreastCancerForm actorRef={breastCancerFormRef} />;
    default:
      return null;
  }
});

DiagnosisFormFactory.displayName = 'DiagnosisFormFactory';

interface DiagnosisDisplayFactoryProps {
  type: DiagnosisType;
  details: DiagnosisDetails;
}

export const DiagnosisDisplayFactory: React.FC<DiagnosisDisplayFactoryProps> = React.memo(({
  type,
  details,
}) => {
  switch (type) {
    case 'breast-cancer':
      return <BreastCancerDisplay details={details} />;
    default:
      return null;
  }
});

DiagnosisDisplayFactory.displayName = 'DiagnosisDisplayFactory';
