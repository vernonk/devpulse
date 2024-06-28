/* global process */

// TODO: Will be removed for db values, temporary for testing APIs
import devpulseConfig from '../../devpulse.config';

const COMMON_HEADERS = {
  Authorization: `Bearer ${process.env.JIRA_API_TOKEN}`,
};

async function get(url) {
  const response = await fetch(url, {
    headers: COMMON_HEADERS,
  });
  return await response.json();
}

async function post(url, body) {
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

export async function getMyPermissions() {
  return await get(`${process.env.BASE_JIRA_API_URL}/mypermissions`);
}

export async function getUserData(query) {
  const endpoint = `${process.env.BASE_JIRA_API_URL}/user/picker`;
  const search = `?query=${query}&maxResults=10&showAvatar=true`;
  return await get(`${endpoint}${search}`);
}

const defaultUserTicketsForDurationQuery = {
  assignee: '',
  duration: '-30days',
};

export async function getUserTicketsForDuration(
  options = {}
) {
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
  const opts = {
    ...defaultUserTicketsForDurationQuery,
    ...options,
  };
  const assignees = opts.assignees.map((assignee) => `'${assignee}'`).join(', ');
  const jql = `assignee was in (${assignees}) AND updated >= ${opts.duration} AND issuetype not in (${IGNORED_ISSUE_TYPES.join(', ')}) ORDER BY ${ORDER_BY.join(', ')}`;
  console.log('jqeury', jql);
  // TOODO: Add error handling 😅
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
