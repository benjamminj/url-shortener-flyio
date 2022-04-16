import { Form, useLoaderData } from "@remix-run/react"
import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime"
import invariant from "tiny-invariant"
import { Input } from "~/components/input"
import {
  createRedirect,
  getRedirectListItems,
  Redirect,
  updateRedirect,
} from "~/models/redirects.server"

type LoaderData = {
  redirects: Awaited<ReturnType<typeof getRedirectListItems>>
}

export const loader: LoaderFunction = async () => {
  const redirects = await getRedirectListItems()
  return {
    redirects,
  }
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData()
  const operation = body.get("operation")

  const url = body.get("url")
  const slug = body.get("slug")

  // TODO: pretty errors
  if (typeof url !== "string" || typeof slug !== "string") {
    return invariant("url and slug are required")
  }

  if (operation === "create") {
    await createRedirect({ url, slug })
  } else if (operation === "edit") {
    const id = body.get("id")
    invariant(typeof id === "string", "id is required")
    await updateRedirect({ id, url, slug })
  }

  return redirect("/dashboard")
}

/**
 * @todo
 *
 * - user mgmt
 * - sidebar
 * - move redirects to a separate route
 * - analytics??
 */
export default function DashboardRoute() {
  const data = useLoaderData<LoaderData>()
  return (
    <main>
      <h1>Redirects</h1>

      <ul className="pl-6">
        {data?.redirects.map((redirect) => (
          <li key={redirect.id} className="list-disc">
            <Form method="post">
              <input type="hidden" name="operation" value="edit" readOnly />
              <input type="hidden" name="id" value={redirect.id} readOnly />

              <Input label="slug" name="slug" defaultValue={redirect.slug} />
              <Input label="url" name="url" defaultValue={redirect.url} />

              <button className="px-3 py-2 text-black dark:bg-white">
                edit
              </button>
            </Form>
          </li>
        ))}
      </ul>

      <Form method="post">
        <input type="hidden" name="operation" value="create" readOnly />
        <label>
          slug
          <input className="text-black" name="slug" />
        </label>
        <label>
          url
          <input className="text-black" type="url" name="url" />
        </label>
        <button className="px-3 py-2 text-black dark:bg-white">add</button>
      </Form>
    </main>
  )
}
