export interface PresignedUrlMap {
  [key: string]: {
    key: string;
    url: string;
  };
}

export type AttachableType = 'Project' | 'User';
