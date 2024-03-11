export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: {
    name: string;
    verified: boolean;
  };
  authTime?: number;
  phone?: {
    number: string;
    verified: boolean;
  };
  roles: string[];
  imgUrl?: string;
  sex?: 'male' | 'female';
  birthday?: string;
  lang?: 'en' | 'de';
  country?: string;
  city?: string;
  address1?: string;
  address2?: string;
  zipcode?: number;
  website?: string;
  socials?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
}

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
}
