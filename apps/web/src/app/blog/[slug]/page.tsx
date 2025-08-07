import BlogPostLoader from "@/features/blog/components/blog-post-loader";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return (
    <>
      <BlogPostLoader slug={slug} />
    </>
  );
}
