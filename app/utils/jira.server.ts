import { json } from "@remix-run/node";

export const getMyPermissions = async () => {
  const response = await fetch(`${process.env.BASE_JIRA_API_URL}/mypermissions`, {
    headers: {
      Authorization: `Bearer ${process.env.JIRA_API_TOKEN}`,
    },
  });
  return json(await response.json());
};

