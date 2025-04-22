"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { ReactMarkdownProps } from "react-markdown/lib/complex-types";

interface MarkdownRendererProps {
  markdown: string;
}

interface CodeProps {
  node: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

export default function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  // Any client-side logic here
  const [isCopied, setIsCopied] = useState<boolean>(false);

  return (
    <div className="markdown-content">
      <ReactMarkdown
        rehypePlugins={[rehypeSanitize, rehypeHighlight]}
        components={{
          code({ node, inline, className, children, ...props }: CodeProps) {
            const codeContent = String(children).replace(/\n$/, "");

            return (
              <div className="relative">
                <code className={className} {...props}>
                  {children}
                </code>
                {!inline && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(codeContent);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="absolute top-2 right-2"
                  >
                    {isCopied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
