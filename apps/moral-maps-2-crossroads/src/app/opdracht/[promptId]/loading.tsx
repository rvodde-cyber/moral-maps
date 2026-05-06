export default function LoadingPromptPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-3 w-40 rounded bg-slate-200" />
          <div className="mt-3 h-8 w-3/4 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-full rounded bg-slate-200" />
          <div className="mt-2 h-4 w-11/12 rounded bg-slate-200" />
          <div className="mt-5 h-72 w-full rounded-2xl bg-slate-200" />
          <div className="mt-5 h-32 w-full rounded-lg bg-slate-200" />
          <div className="mt-6 flex gap-3">
            <div className="h-10 w-36 rounded-full bg-slate-200" />
            <div className="h-10 w-36 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    </main>
  );
}
