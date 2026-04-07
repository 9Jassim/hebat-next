import { NextResponse } from "next/server"
import Client from "@/lib/api"

const slugifyCategory = str =>
  str
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") || ""

export async function GET(request, { params }) {
  const { id } = params

  try {
    const res = await Client.get(`/products/${id}`)
    const { product } = res.data

    if (!product) {
      return NextResponse.redirect(new URL("/en/products", request.url))
    }

    const categoryName = product.categories?.[0]?.name || "others"
    const category = slugifyCategory(categoryName)
    const slug = product.slug

    return NextResponse.redirect(
      new URL(
        `/en/products/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`,
        request.url
      ),
      { status: 301 }
    )
  } catch {
    return NextResponse.redirect(new URL("/en/products", request.url))
  }
}
