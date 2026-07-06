// Bikes that have an interactive 3D model available in /public/models/<slug>.glb
const BIKES_WITH_3D = new Set<string>(['yamaha-tenere-700']);

export function has3DModel(slug: string): boolean {
  return BIKES_WITH_3D.has(slug);
}

export function get3DModelPath(slug: string): string {
  return `/models/${slug}.glb`;
}
