/* global process */
import prettyMs from 'pretty-ms';
// TODO: Will be removed for db values, temporary for testing APIs
import devpulseConfig from '../../devpulse.config';

const COMMON_HEADERS = {
  Authorization: `Bearer ${process.env.JIRA_API_TOKEN}`,
  Accept: 'application/json',
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

/*
 * TODO: THESE CALCULATIONS HERE AND BELOW ARE NOT CORRECT THERE'S A FLAW IN THE LOGIC AT THE MOMENT
 */
function calculateTimeInStatus(changelog, statusName, assignee) {
  let totalTime = 0;
  let currentStartTime = null;
  let currentAssignee = null;
  const assigneeLower = assignee.toLowerCase();

  changelog.histories.forEach(history => {
    history.items.forEach(item => {
      if (item.field === 'status' || item.field === 'assignee') {
        // Track when the issue is assigned to the user
        if (item.field === 'assignee') {
          currentAssignee = item.to?.toLowerCase();
        }

        // Track status changes
        if (item.field === 'status') {
          if (item.toString === statusName && currentAssignee === assigneeLower) {
            // Status changed to the desired status and the current assignee is the user
            currentStartTime = new Date(history.created);
          } else if (item.fromString === statusName && currentStartTime && currentAssignee === assigneeLower) {
            // Status changed from the desired status and the current assignee is the user
            const endTime = new Date(history.created);
            totalTime += endTime - currentStartTime;
            currentStartTime = null;
          }
        }
      }
    });
  });

  // If the issue is still in the desired status and assigned to the user
  if (currentStartTime) {
    totalTime += new Date() - currentStartTime;
  }

  return totalTime ? prettyMs(totalTime) : '-';
}

function calculateTimeInFixIssuesInProgress(changelog) {
  let totalTime = 0;
  let currentStartTime = null;

  changelog.histories.forEach(history => {
    history.items.forEach(item => {
      if (item.field === 'status') {
        if (item.toString === 'Fix Issues In Progress') {
          currentStartTime = new Date(history.created);
        } else if (item.fromString === 'Fix Issues in Progress' && currentStartTime) {
          const endTime = new Date(history.created);
          totalTime += endTime - currentStartTime;
          currentStartTime = null;
        }
      }
    });
  });
  if (currentStartTime) {
    totalTime += new Date() - currentStartTime;
  }
  return totalTime ? prettyMs(totalTime) : '-';
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
  // TOODO: Add error handling 😅
  const baseResults = await post(`${endpoint}`, {
    jql,
    expand: ['changelog'],
    startAt: 0,
    maxResults: MAX_RESULTS,
    fields: [
      'summary',
      'status',
      'assignee',
    ],
  });
  return {
    ...baseResults,
    issues: baseResults.issues.map((issue) => ({
      fields: issue.fields,
      id: issue.id,
      key: issue.key,
      link: `${process.env.BASE_JIRA_URL}/browse/${issue.key}`,
      timeInFixIssues: calculateTimeInFixIssuesInProgress(issue.changelog),
      timeInProgress: calculateTimeInStatus(issue.changelog, 'Dev In Progress', opts.assignees[0]),
      timeInValidation: calculateTimeInStatus(issue.changelog, 'Dev Validation', opts.assignees[0])
    }))
  }
}
