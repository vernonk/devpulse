import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

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

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          {children}
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
