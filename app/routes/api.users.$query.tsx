import { LoaderFunctionArgs } from '@remix-run/node';
import { getUserData } from '~/utils/jira.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const query = new URL(request.url).searchParams.get('q');
  return await getUserData(query as string);
}
