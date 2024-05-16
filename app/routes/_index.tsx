import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getMyPermissions } from "~/utils/jira.server";

export const meta: MetaFunction = () => {
  return [
    { title: "DevPulse" },
    { name: "description", content: "Stay on the pulse of your team" },
  ];
};

export const loader = async () => {
  // just testing api access
  return await getMyPermissions();
}

export default function Index() {
  const permissions = useLoaderData();
  console.log(permissions);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to the dashboard</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
