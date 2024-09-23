import { API_URL } from '../constants/base.const';
import { getStorageValue } from '../util/localStorage.util';

type Props = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
};

export const fetchAPI = async ({ url, method, body }: Props) => {
  try {
    const token = getStorageValue('token');
    const response = await fetch(`${API_URL}${url}`, {
      method: method,
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: token || '',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return { response, data };
  } catch (e) {
    console.error('fetchAPI error: ', e);
    return { response: undefined, data: undefined };
  }
};
