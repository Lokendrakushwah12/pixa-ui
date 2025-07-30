export interface PersonalInfo {
  name: string;
  github: string;
  twitter: string;
  linkedin: string;
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
