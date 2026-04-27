import type { Role } from "@/types/common.types";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface JWTPayload {
  sub: string;
  role: Role;
  exp: number;
}