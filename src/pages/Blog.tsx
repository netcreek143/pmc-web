import { useEffect, useState } from 'react';
import LoadingState from '../components/LoadingState';
import { fetcher } from '../lib/api';

type Post = {
    id: number;
    title: string;
    excerpt: string;
    author: string;
    published_at: string;
    cover_image_url: string;
};

export default function Blog() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const data = await fetcher('/api/blog-posts');
            setPosts(data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (loading) return <LoadingState label="Loading blog" />;

    return (
        <div className="space-y-8">
            <header className="rounded-3xl border border-slate-200 bg-white p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Blog</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Insights for modern bakeries</h1>
            </header>
            <div className="grid gap-6 md:grid-cols-2">
                {posts.map((post) => (
                    <article key={post.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <img src={post.cover_image_url} alt={post.title} className="h-48 w-full object-cover" />
                        <div className="p-6">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{new Date(post.published_at).toDateString()}</p>
                            <h3 className="mt-2 text-lg font-semibold text-slate-900">{post.title}</h3>
                            <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
                            <p className="mt-4 text-xs text-slate-400">By {post.author}</p>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
