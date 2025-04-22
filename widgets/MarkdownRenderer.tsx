// components/MarkdownRenderer.tsx
"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

type Props = {
  content: string;
};

const MarkdownRenderer = ({ content }: Props) => {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ node, ...props }) => (
          <h1
            className="text-4xl font-bold text-primary mt-6 mb-4"
            {...props}
          />
        ),
        h2: ({ node, ...props }) => (
          <h2
            className="text-3xl font-semibold text-primary hover:text-popup mt-5 mb-3"
            {...props}
          />
        ),
        h3: ({ node, ...props }) => (
          <h3
            className="text-2xl font-medium text-primary mt-4 mb-2"
            {...props}
          />
        ),
        p: ({ node, ...props }) => (
          <p
            className="text-base leading-relaxed text-primary my-2"
            {...props}
          />
        ),
        a: ({ node, href, ...props }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 transition"
            {...props}
          />
        ),
        ul: ({ node, ...props }) => (
          <ul
            className="list-disc list-inside ml-5 text-primary mb-4"
            {...props}
          />
        ),
        ol: ({ node, ...props }) => (
          <ol
            className="list-decimal list-inside ml-5 text-primary mb-4"
            {...props}
          />
        ),
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-gray-400 pl-4 italic text-gray-600 my-4"
            {...props}
          />
        ),
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              className="rounded-md my-4 overflow-x-auto text-sm"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code
              className="bg-gray-200 text-sm rounded px-1 py-0.5"
              {...props}
            >
              {children}
            </code>
          );
        },
        img: ({ node, src, alt, ...props }) => (
          <img
            src={src || ""}
            alt={alt || ""}
            className="my-4 w-full max-w-md rounded shadow-md"
            {...props}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
