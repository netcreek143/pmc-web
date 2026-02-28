export default function CustomPrinting() {
    return (
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Custom Printing</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Make every box your brand ambassador</h1>
                <p className="mt-4 text-sm text-slate-600">
                    Share your logo, finishes, and embossing preferences. Our design team will respond with a custom quote.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-slate-600">
                    <li>• Foil stamping and soft-touch lamination</li>
                    <li>• Window cutouts and premium inserts</li>
                    <li>• Pantone matched pastel palettes</li>
                </ul>
            </div>
            <form className="rounded-3xl border border-slate-200 bg-white p-8">
                <h2 className="text-lg font-semibold text-slate-900">Start your custom inquiry</h2>
                <div className="mt-4 space-y-3">
                    {['Brand name', 'Email', 'Packaging type', 'Timeline'].map((label) => (
                        <input key={label} placeholder={label} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
                    ))}
                </div>
                <button className="mt-6 w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white">
                    Send request
                </button>
            </form>
        </div>
    );
}
