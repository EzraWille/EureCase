export enum DurationType {
  DAY = 'DAY',
  MONTH = 'MONTH',
  YEAR = 'YEAR'
}

export enum CaseType {
  DESCRIPTIVE = 'DESCRIPTIVE',
  ILLUSTRATIVE = 'ILLUSTRATIVE',
  CUMULATIVE = 'CUMULATIVE',
  CRITICAL_INSTANCE = 'CRITICAL_INSTANCE'
}

export interface ICaseInfo {
  uuid: string;
  name: string;
  caseAbstract: string;
  budget: number;
  startDate: string;
  expiryDate: string;
  duration: number;
  durationType: DurationType;
  caseType: CaseType;
  nickname: string;
}
export interface ICaseRequirement {
  name: string;
  description: string;
  type: string;
  responsibility: string;
  owner: string;
}

export interface ICaseDataRequirements {
  uuid: string;
  caseRequirements: ICaseRequirement[];
}
export interface ICase {
  id: number;
  uuid: string;
  name: string;
  caseAbstract: string;
  budget: number;
  startDate: string;
  expiryDate: string;
  status: string;
  duration: number;
  durationType: string;
  caseType: string;
  nickname: string;
  paymentPlanningMethod: string | null;
  paymentPlanning: any[];
  caseRequirements: CaseRequirement[] | null;
  ownerUsername: string;
  participantUsername: string | null;
  modifiedDate: string | null;
  allowedParticipants:string|null;
}

export interface CaseRequirement {
  name: string | null;
  description: string | null;
  type: string | null;
  responsibility: string | null;
  owner: string | null;
}
