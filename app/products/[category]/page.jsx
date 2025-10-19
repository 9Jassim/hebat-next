import Products from "@/components/Products"

export async function generateMetadata({ params }) {
  const category = params.category.replace(/-/g, " ")
  return {
    title: `${category}`,
    description: `Discover premium ${category} from Hebat.`,
  }
}

export default function CategoryPage() {
  return <Products />
}
