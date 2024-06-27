/* global process */

// TODO: Will be removed for db values, temporary for testing APIs
import devpulseConfig from '../../devpulse.config';

const COMMON_HEADERS = {
  Authorization: `Bearer ${process.env.JIRA_API_TOKEN}`,
};

const get = async (url) => {
  const response = await fetch(url, {
    headers: COMMON_HEADERS,
  });
  return await response.json();
}

const post = async (url, body) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...COMMON_HEADERS,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return await response.json();
}

export const getMyPermissions = async () => {
  return await get(`${process.env.BASE_JIRA_API_URL}/mypermissions`);
};

export const getUserData = async (query) => {
  const endpoint = `${process.env.BASE_JIRA_API_URL}/user/picker`;
  const search = `?query=${query}&maxResults=10&showAvatar=true`;
  return await get(`${endpoint}${search}`);
}

const defaultUserTicketsForDurationQuery = {
  assignee: '',
  duration: '-30days',
};

export const getUserTicketsForDuration = async (
  options = defaultUserTicketsForDurationQuery
) => {
  const endpoint = `${process.env.BASE_JIRA_API_URL}/search`;
  // TODO: Smarten up jql when moving these to db driven values
  const {
    JIRA: {
      TICKETS_FOR_DURATION: {
        IGNORED_ISSUE_TYPES,
        MAX_RESULTS,
        ORDER_BY,
      },
    },
  } = devpulseConfig;
  const jql = `assignee was ${options.assignee} AND updated >= ${options.duration} AND issuetype not in (${IGNORED_ISSUE_TYPES.join(', ')}) ORDER BY ${ORDER_BY.join(', ')}`;
  return await post(`${endpoint}`, {
    jql,
    startAt: 0,
    maxResults: MAX_RESULTS,
    fields: [
      'summary',
      'status',
      'assignee',
    ],
  });
}
