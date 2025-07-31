import { BlogPostForm } from "~/features/blog/components/blog-post-form";

export default function NewBlogPostPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Новая запись</h1>
        <p className="text-muted-foreground">
          Создайте новую запись или страницу для вашего блога
        </p>
      </div>

      <BlogPostForm mode="create" />
    </div>
  );
}
