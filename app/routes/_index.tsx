import type { LinksFunction, MetaFunction } from '@remix-run/node';

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

export default function Index() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>DevPulse</h1>
      <p>Stay on the pulse of your team</p>
    </div>
  );
}