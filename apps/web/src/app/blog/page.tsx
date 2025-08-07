import Breadcrumbs from "@/components/breadcrumbs";
import BlogList from "@/features/blog/components/blog-list";

export default function BlogListingPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Блог", href: "/blog" },
        ]}
      />
      <main>
        <BlogList />
      </main></>
  );
}
