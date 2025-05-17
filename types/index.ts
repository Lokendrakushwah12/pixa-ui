export interface PersonalInfo {
  name: string;
  email: string;
  github: string;
  twitter: string;
}

export interface LastUpdated {
  date: string;
  time: string;
}

export interface websiteData {
  personalInfo: PersonalInfo;
  about: string;
  lastUpdated: LastUpdated;
}
