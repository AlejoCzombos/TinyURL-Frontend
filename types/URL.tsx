export interface URLResponse {
  key: string;
  url: string;
  alias: string;
  hit: number;
  expiresAt: string | null;
  createdAt: string;
}

export interface URLCreate {
  url: string;
  alias?: string;
  expiresAt?: string;
}
