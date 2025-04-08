export type User = {
  name: string;
  surname: string;
  apartment: string;
  email: string;
  phone: string;
};

export type UserForResponse = {
  id: number;
  email: string;
  username: string;
  name: string;
  surname: string;
  role: 'user' | 'security' | 'admin';
  phone: string;
  apartmentInfo: {
    id: number;
    identifier: string;
  };
};

export type UserFilterParams = {
  email?: string;
  role?: string;
};