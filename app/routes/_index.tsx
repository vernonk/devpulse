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
  return await getMyPermissions();
}

function hasPermissionEmoji(permission) {
  return permission.havePermission ? "✅" : "❌";
}

export default function Index() {
  const permissions = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>DevPulse</h1>

      <h2>Permissions</h2>
      <dl>
        {Object.entries(permissions.permissions).map(([key, value]) => (
          <>
            <dt key={`${value.id}-name`}>
              <strong>{value.name} {hasPermissionEmoji(value)}</strong>
            </dt>
            <dt key={`${value.id}-desc`}>{value.description}</dt>
          </>
        ))}
      </dl>
    </div>
  );
}