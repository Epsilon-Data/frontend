import { UserDetails } from '@app/domain/UserDetails';
// const avatarImg = import.meta.env.VITE_ASSETS_BUCKET + '/avatars/avatar5.webp';

// const testUser = {
//   id: 1,
//   firstName: 'Chris',
//   lastName: 'Johnson',
//   imgUrl: avatarImg,
//   userName: '@john1989',
//   email: {
//     name: 'chris.johnson@altence.com',
//     verified: true,
//   },
//   phone: {
//     number: '+18143519459',
//     verified: false,
//   },
//   sex: 'male',
//   birthday: '01/26/2022',
//   lang: 'en',
//   country: 'GB',
//   city: 'London',
//   address1: '14 London Road',
//   zipcode: 5211,
//   website: 'altence.com',
//   socials: {
//     twitter: '@altence_team',
//     facebook: 'https://facebook.com/groups/1076577369582221',
//     linkedin: 'https://linkedin.com/company/altence',
//   },
// };

const exampleUserDetails: UserDetails = {
  sub: '123e4567-e89b-12d3-a456-426614174000',
  name: 'John Doe',
  email: 'john.doe@example.com',
  email_verified: true,
  given_name: 'John',
  family_name: 'Doe',
  preferred_username: 'jdoe',
  auth_time: 1728837300, // e.g., Unix timestamp in seconds
  realm_access: {
    roles: ['user', 'offline_access'],
  },
  resource_access: {
    'realm-management': {
      roles: ['manage-users', 'view-realm'],
    },
  },
  exp: 1728840900, // token expiration timestamp (in seconds)
};

export const persistToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

export const readToken = (): string => {
  return localStorage.getItem('accessToken') || 'bearerToken';
};

export const persistUser = (user: UserDetails | null): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const readUser = (): UserDetails | null => {
  const userStr = localStorage.getItem('user');

  return userStr ? JSON.parse(userStr) : exampleUserDetails;
};

export const deleteToken = (): void => localStorage.removeItem('accessToken');
export const deleteUser = (): void => localStorage.removeItem('user');

export const persistCsrf = (csrf: string): void => {
  localStorage.setItem('csrf', csrf);
};

export const readCsrf = (): string => {
  return localStorage.getItem('csrf') || '';
};

export const deleteCsrf = (): void => localStorage.removeItem('csrf');
