export interface Deliverable {
    name: string;
    percentage: number;
    amount: number;
    startDate: string;
    endDate: string;
    description: string;
    relatedTo: string | null;
    relationType: string | null;
  }
  
  export interface IDelivarblePayment {
    caseUUID: string;
    deliverables: Deliverable[];
  }
  