export interface UserDetails {
  sub: string;
  name: string;
  email: string;
  email_verified: boolean;
  given_name: string;
  family_name: string;
  preferred_username: string;
  auth_time: number;
  realm_access?: {
    roles?: string[];
  };
  resource_access?: {
    'realm-management'?: {
      roles?: string[];
    };
  };
  exp: number;
}
