export interface FormResponses {
  Usage: string;
  Discovery: string;
  Questions: string[];
}

export interface FormAgreements {
  Staff: boolean;
  Info: boolean;
}

export enum ApplicationStatus {
  PENDING = 0,
  DENIED,
  ACCEPTED
}

export interface Application {
  _id: string;
  name: string;
  email: string;
  discordID: string;
  responses: FormResponses | string;
  agreements: FormAgreements | string;
  IP: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}