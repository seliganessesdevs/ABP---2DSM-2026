export interface LoginDTO {
      email: string;
      password: string;
}

export interface AuthPayload {
      sub: string;
      role: "ADMIN" | "SECRETARIA";
      exp: number;
}

export interface AuthUserResponse {
      id: number;
      name: string;
      email: string;
      role: "ADMIN" | "SECRETARIA";
}

export interface LoginResponse {
      token: string;
      user: AuthUserResponse;
}