import { json } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { asc } from 'drizzle-orm';

import { 
  Button,
  Group,
  List,
  Select,
} from '@mantine/core';

import MetricsTable from './MetricsTable';

import { getUserTicketsForDuration } from '../../.server/jira.server';
import { db } from '../../.server/db.server';
import { members } from '../../drizzle/schema.server';

export async function loader({ request }) {
  const username = new URL(request.url).searchParams.get('u');
  // if there's a username in search params, go ahead and load the metrics for that user
  if (username) {
    // load metric data to support deeplinking from team page
    // getUserTicketsForDuration({users});
  }
  // get team members for dropdown
  const myTeam = await db.query.members.findMany({
    columns: {
      name: true,
      username: true,
    },
    orderBy: [asc(members.name)]
  });
  return json({
    teamMembers: myTeam
  });
}

export async function action({ request }) {
  // TODO: Add error handling around this, this is purely happy path at the moment.
  const formData = await request.formData();
  const teamMembers = JSON.parse(formData.get('teamList'));
  const selectedUsers = formData.get('selectedUsers').split(',');
  const usersForQuery = selectedUsers.map((user) => {
    const person = teamMembers.find((m) => m.name === user);
    return person?.username;
  });
  const metrics = await getUserTicketsForDuration({ assignees: usersForQuery });
  return {
    metrics
  }
}

export default function Insights() {
  const { teamMembers, metrics: metricsLoaderData } = useLoaderData();
  const actionData = useActionData();
  const metricsActionData = actionData?.metrics;
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dropdownOptions = teamMembers.map(m => m.name);
  const onChange = (value) => {
    setSelectedUsers(value);
  };

  const preferredData = metricsActionData || metricsLoaderData;

  return (
    <div>
      <h1>Insights</h1>
      <Form method="post">
        <Group>
          <input type="hidden" name="teamList" value={JSON.stringify(teamMembers)} />
          <input type="hidden" name="selectedUsers" value={selectedUsers} />
          <Select 
            data={dropdownOptions}
            onChange={onChange}
            placeholder="Choose team member"
          />
          <Button type="submit">Save</Button>
        </Group>
      </Form>
      {preferredData ? (
        <article>
          <section>
            {/* <h2>{selectedUsers}</h2> */}
            <h3>Last 30 days </h3>
            <p>
              <strong>Total issue{`${preferredData.total > 1 ? 's' : ''}`}:</strong>
              {' '}
              {preferredData.total}
            </p>
            <MetricsTable data={preferredData} />
          </section>
        </article>
      ) : null}
    </div>
  );
}
