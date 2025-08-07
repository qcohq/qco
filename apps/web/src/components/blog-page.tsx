import { blogPosts } from "@/data/blog-posts";
import BlogPostCard from "./blog-post-card";

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
          Наш Блог
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Здесь мы делимся последними новостями из мира высокой моды, советами
          от ведущих стилистов, обзорами новых коллекций и вечной классики.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
