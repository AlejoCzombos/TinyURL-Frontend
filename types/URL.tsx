export interface URLResponse {
  key: string;
  url: string;
  alias: string;
  hit: number;
  createdAt: number[];
  expiresAt: number[] | null;
}

export interface URLCreate {
  url: string;
  alias?: string;
  expiresAt?: string | null;
}
