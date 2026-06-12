import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ content, date }) => {
  if (!content) return null;

  let formattedContent = typeof content === "string" 
    ? content.replace(/\\n/g, "\n") 
    : content;

  if (typeof formattedContent === "string") {
    const trimmed = formattedContent.trim();
    if (trimmed.startsWith("```")) {
      // Remove starting ```markdown or ```
      const withoutLeading = trimmed.replace(/^```[a-zA-Z0-9]*\s*\n/, "");
      // Remove trailing ```
      const withoutTrailing = withoutLeading.replace(/\n\s*```$/, "");
      formattedContent = withoutTrailing;
    }

    // Format date for the report
    const formattedDate = date 
      ? new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    // Replace template placeholders
    formattedContent = formattedContent
      .replace(/\[Your Name\]/g, "InsuranceAI")
      .replace(/\[Date\]/g, formattedDate);
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-base font-black uppercase tracking-wider mt-5 mb-2.5 text-white border-b border-slate-900 pb-1.5" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-sm font-black uppercase tracking-wider mt-4 mb-2 text-slate-100" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-xs font-black uppercase tracking-wider mt-3 mb-1.5 text-slate-200" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="mb-3 last:mb-0 text-slate-350 leading-relaxed text-xs" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-5 mb-4 space-y-1 text-slate-350" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-5 mb-4 space-y-1 text-slate-350" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="text-slate-350 pl-0.5 text-xs" {...props} />
        ),
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-4 rounded-xl border border-slate-900 bg-slate-950/40">
            <table className="min-w-full divide-y divide-slate-900 text-[11px] font-sans" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => (
          <thead className="bg-slate-900/50" {...props} />
        ),
        tbody: ({ node, ...props }) => (
          <tbody className="divide-y divide-slate-900 bg-transparent" {...props} />
        ),
        tr: ({ node, ...props }) => (
          <tr className="hover:bg-slate-900/20 transition-colors" {...props} />
        ),
        th: ({ node, ...props }) => (
          <th className="px-4 py-2.5 text-left font-extrabold text-slate-250 uppercase tracking-wider border-b border-slate-900 text-[10px]" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="px-4 py-2 text-slate-350 border-t border-slate-900/40" {...props} />
        ),
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          const isInline = !className && !match;
          
          return !isInline ? (
            <div className="relative my-4 select-all group">
              <pre className="bg-slate-950 border border-slate-900 p-4 rounded-2xl font-mono text-[10px] text-indigo-350 overflow-x-auto shadow-inner leading-relaxed">
                <code {...props} className={className}>
                  {children}
                </code>
              </pre>
            </div>
          ) : (
            <code 
              className="bg-slate-900 text-indigo-400 px-1.5 py-0.5 rounded-lg text-[10px] font-mono border border-slate-900/60 font-bold" 
              {...props}
            >
              {children}
            </code>
          );
        },
        strong: ({ node, ...props }) => (
          <strong className="font-extrabold text-white" {...props} />
        ),
        em: ({ node, ...props }) => (
          <em className="italic text-slate-200" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-2 border-indigo-500 pl-3.5 my-3 italic text-slate-400 bg-slate-900/30 py-2 rounded-r-xl" {...props} />
        )
      }}
    >
      {formattedContent}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
