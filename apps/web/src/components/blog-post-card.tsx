import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@qco/ui/components/card";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="flex flex-col h-full p-0 border hover:border-primary/60 hover:shadow-md transition-all duration-200 bg-card/80">
      <div className="aspect-[16/10] relative overflow-hidden rounded-t-xl">
        <Image
          src={post.featuredImage?.url || "/placeholder.svg"}
          alt={`Image for post: ${post.title}`}
          fill
          className="object-cover object-top w-full h-full"
          priority={false}
        />
      </div>
      <CardContent className="p-4 sm:p-6 flex-grow">
        <Link
          href={`/blog/${post.slug}`}
          aria-label={`Read post: ${post.title}`}
        >
          <CardTitle className="text-lg md:text-xl font-playfair mb-2 hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="p-4 sm:p-6 pt-0">
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href={`/blog/${post.slug}`}>Читать далее</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
