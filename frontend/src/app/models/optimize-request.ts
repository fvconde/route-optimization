export interface OptimizeRequest {
  points: number;
  generations: number;
  vehicles: number;
  speed_kmh: number;
  max_capacity: number;
  max_distance: number;
  seed?: number;
}
