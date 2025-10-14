export interface AuthenticatedUser {
  userId: string;
  email: string;
  displayName: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
