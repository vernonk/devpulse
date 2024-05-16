import { json } from "@remix-run/node";

const COMMON_HEADERS = {
  Authorization: `Bearer ${process.env.JIRA_API_TOKEN}`,
};

export const getMyPermissions = async () => {
  const response = await fetch(`${process.env.BASE_JIRA_API_URL}/mypermissions`, {
    headers: COMMON_HEADERS,
  });
  return json(await response.json());
};

