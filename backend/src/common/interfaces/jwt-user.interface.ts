// src/common/interfaces/jwt-user.interface.ts
export interface JwtUser {
  id: number;
  usuario: string;
  roles?: any[];
}