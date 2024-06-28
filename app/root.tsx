import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { navigate } from '@remix-run/node';
import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import {
  Box,
  ColorSchemeScript,
  Container,
  Group,
  MantineProvider
} from '@mantine/core';

import coreStylesHref from '@mantine/core/styles.css?url';
import chartsStylesHref from '@mantine/charts/styles.css?url';
import notificationsStylesHref from '@mantine/notifications/styles.css?url';
import datesStylesHref from '@mantine/dates/styles.css?url';
import baseStylesHref from '~/styles/base.css?url';

import logo from './images/devpulse-logo.png';

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
  { rel: 'stylesheet', href: baseStylesHref },
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
          <Container mb={20} mt={20}>
            <Group gap={0}>
              <Box mr={20} mt={10}>
                <img src={logo} alt="DevPulse Logo" height="30" />
              </Box>
              <nav>
                <NavLink 
                  className={({ isActive }) => isActive ? 'active' : ''}
                  to="/"
                >
                  Home
                </NavLink>
                <NavLink
                  className={({ isActive }) => isActive ? 'active' : ''}
                  to="/insights"
                >
                  Insights
                </NavLink>
                <NavLink
                  className={({ isActive }) => isActive ? 'active' : ''}
                  to="/team"
                >
                  Team
                </NavLink>
              </nav>
            </Group>
            {children}
          </Container>
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
