import { LoaderFunction } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"
import { getRedirect } from "~/models/redirects.server"

export const loader: LoaderFunction = async ({ request, params }) => {
  const { slug } = params
  const headers = request.headers
  const etag = headers.get("if-none-match")
  console.log(">>>>", etag)
  // TODO: better validation
  if (typeof slug !== "string") throw invariant("slug is required")

  const redirect = await getRedirect({ slug })
  if (!redirect) throw new Response("Not found", { status: 404 })

  if (etag === redirect.url) {
    return new Response(null, {
      status: 304,
    })
  }

  return new Response(null, {
    // TODO: dynamic whether it's permanent or temporary
    status: 302,
    headers: {
      Location: redirect.url,
      // "Cache-Control": "max-age=1, stale-while-revalidate=", // 5 minutes
      ETag: redirect.url,
      "If-None-Match": redirect.url,
    },
  })
}
