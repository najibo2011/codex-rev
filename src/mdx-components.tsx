import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children, ...props }) => (
      <h2 className="mt-10 text-3xl font-semibold text-slate-900 dark:text-white" {...props}>
        {children}
      </h2>
    ),
    p: ({ children, ...props }) => (
      <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-200" {...props}>
        {children}
      </p>
    ),
    ...components,
  };
}
