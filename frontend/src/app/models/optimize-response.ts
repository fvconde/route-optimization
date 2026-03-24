export interface Point {
  id: number;
  x: number;
  y: number;
  priority: number;
}

export interface OptimizeResponse {
  routes: number[][];
  fitness_history: number[];
  total_distance: number;
  estimated_time_h: number;
  points: Point[];
}
