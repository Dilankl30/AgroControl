export interface SensorComponent {
  id: string;
  key: string;
  title: string;
  badge: string;
  text: string;
  stats: string[];
  kind: 'card' | 'sensor' | 'probe';
  value?: string;
  unit?: string;
  statusText?: string;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface SensorHotspot {
  key: string;
  world: Vector3D;
  label: string;
}

export interface AuthUserState {
  email: string;
  name?: string;
  avatarUrl?: string;
  isAuthenticated: boolean;
}
