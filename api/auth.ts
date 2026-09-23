import apiClient from '@/lib/axios';
import { setToken, setStoredUser } from '@/lib/auth';

interface LoginPayload {
  username: string;
  password: string;
}

export async function loginUser(payload: LoginPayload) {
  const { data } = await apiClient.post('/auth/login', {
    ...payload,
    expiresInMins: 60,
  });
  setToken(data.token);
  setStoredUser({
    id: data.id,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    image: data.image,
  });
  return data;
}
