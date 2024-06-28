import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { useCallback, useRef, useState } from 'react';
import { asc } from 'drizzle-orm';

import { Button } from '@mantine/core';

import UserTypeahead from '../../components/UserTypeahead/UserTypeahead';
import TeamMembers from './TeamMembers';

import { db } from '../../.server/db.server';
import { members } from '../../drizzle/schema.server';

export async function loader() {
  const myTeam = await db.query.members.findMany({
    orderBy: [asc(members.name)]
  });
  return json(myTeam);
}

export async function action({ request }) {
  const formData = await request.formData();
  const selectedUsers = formData.get('selectedUsers').split(',');
  const dbValues = selectedUsers.map((user) => {
    const [username, name] = user.split(':');
    return { name, username };
  }).filter((u) => !!u.username);
  if (dbValues.length) {
    // TODO: Add logic to ensure no dupes (should already be handled by no dupes in typeahead)
    await db.insert(members).values(dbValues);
  }
  return redirect('/team');
}

export default function Team() {
  const members = useLoaderData();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const resetCombo = useRef(() => {});
  const getResetCombo = useCallback((resetFn) => {
    resetCombo.current = resetFn;
  }, []);
  const onSelectionChange = (value) => {
    setSelectedUsers(value);
  };

  return (
    <div>
      <h1>Team Members</h1>
      <Form method="post" onSubmit={() => { resetCombo() }}>
        <input type="hidden" name="selectedUsers" value={selectedUsers} />
        <UserTypeahead
          excludedValues={members.map((member) => `${member.username}:${member.name}`)}
          getResetCombo={getResetCombo}
          onSelectionChange={onSelectionChange}
          placeholder="Add team members" 
        />
        <Button type="submit">Save</Button>
      </Form>
      <TeamMembers members={members} />
    </div>
  );
}
