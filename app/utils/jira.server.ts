import { json } from '@remix-run/node';

const COMMON_HEADERS = {
  Authorization: `Bearer ${process.env.JIRA_API_TOKEN}`,
};

const get = async (url: string) => {
  const response = await fetch(url, {
    headers: COMMON_HEADERS,
  });
  return json(await response.json());
}

export const getMyPermissions = async () => {
  return await get(`${process.env.BASE_JIRA_API_URL}/mypermissions`);
};

export const getUserData = async (query: string) => {
  const endpoint = `${process.env.BASE_JIRA_API_URL}/user/picker`;
  const search = `?query=${query}&maxResults=10&showAvatar=true`;
  return await get(`${endpoint}${search}`);
}