export interface Recommendation<T> {
  value: T;
  score: number;
  pros: string[];
  cons: string[];
}
