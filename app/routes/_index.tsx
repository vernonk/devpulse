import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { getMyPermissions } from '~/utils/jira.server';

import coreStylesHref from '@mantine/core/styles.css?url'; 
import chartsStylesHref from '@mantine/charts/styles.css?url';
import notificationsStylesHref from '@mantine/notifications/styles.css?url';
import datesStylesHref from '@mantine/dates/styles.css?url';

export const meta: MetaFunction = () => {
  return [
    { title: 'DevPulse' },
    { name: 'description', content: 'Stay on the pulse of your team' },
  ];
};

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: coreStylesHref },
  { rel: 'stylesheet', href: chartsStylesHref },
  { rel: 'stylesheet', href: datesStylesHref },
  { rel: 'stylesheet', href: notificationsStylesHref },
];

export const loader = async () => {
  return await getMyPermissions();
}

function hasPermissionEmoji(permission) {
  return permission.havePermission ? '✅' : '❌';
}

export default function Index() {
  const permissions = useLoaderData();
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>DevPulse</h1>

      <h2>Permissions</h2>
      <dl>
        {Object.values(permissions.permissions).map((value) => (
          <>
            <dt key={`${value.id}-name`}>
              <strong>{value.name} {hasPermissionEmoji(value)}</strong>
            </dt>
            <dd key={`${value.id}-desc`}>{value.description}</dd>
          </>
        ))}
      </dl>
    </div>
  );
}