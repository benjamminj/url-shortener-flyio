import type { Redirect } from "@prisma/client"

import { prisma } from "~/db.server"

export type { Redirect } from "@prisma/client"

export const getRedirect = async ({ slug }: Pick<Redirect, "slug">) => {
  return prisma.redirect.findUnique({ where: { slug } })
}

// TODO: filter by user id
export const getRedirectListItems = async () => {
  return prisma.redirect.findMany({})
}

// TODO: docssss
export const createRedirect = async (data: Pick<Redirect, "slug" | "url">) => {
  return prisma.redirect.create({
    data,
  })
}

export const updateRedirect = async (
  data: Pick<Redirect, "slug" | "url" | "id">
) => {
  return prisma.redirect.update({
    where: { id: data.id },
    data,
  })
}
