'use client';

import { useState } from 'react';

interface Example {
  icon: string;
  title: string;
  description: string;
  tags: string[];
  code: string;
  useCases: string[];
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface ExamplesGridProps {
  examples: Example[];
}

export default function ExamplesGrid({ examples }: ExamplesGridProps) {
  const [expandedExample, setExpandedExample] = useState<number | null>(null);

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    // Could add a toast notification here
  };

  const toggleExpand = (index: number) => {
    setExpandedExample(expandedExample === index ? null : index);
  };

  return (
    <div>
      {/* Examples Grid */}
      <div className="grid grid-cols-1 gap-6">
        {examples.map((example, index) => (
          <div
            key={index}
            className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-shadow"
          >
            {/* Card Header */}
            <div className="card-body">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{example.icon}</div>
                <div className="flex-1">
                  <h2 className="card-title text-xl mb-2">{example.title}</h2>
                  <p className="text-base-content/70 text-sm mb-3">
                    {example.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {example.tags.map((tag, i) => (
                      <span key={i} className="badge badge-ghost">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Preview */}
              <div className="relative">
                <div
                  className={`mockup-code text-xs transition-all duration-300 ${
                    expandedExample === index
                      ? 'max-h-[600px]'
                      : 'max-h-[200px]'
                  } overflow-hidden`}
                >
                  <pre className="px-5">
                    <code>{example.code}</code>
                  </pre>
                </div>

                {/* Overlay gradient when collapsed */}
                {expandedExample !== index && (
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-base-300 to-transparent pointer-events-none" />
                )}
              </div>

              {/* Action Buttons */}
              <div className="card-actions justify-between mt-4">
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => toggleExpand(index)}
                >
                  {expandedExample === index ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                      Show Less
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      Show More
                    </>
                  )}
                </button>

                <button
                  className="btn btn-sm btn-accent"
                  onClick={() => copyCode(example.code, index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy Code
                </button>
              </div>

              {/* Use Cases */}
              {expandedExample === index && (
                <div className="mt-4 p-4 bg-base-200 rounded-lg">
                  <h3 className="font-semibold mb-2 text-sm">Use Cases:</h3>
                  <ul className="text-sm space-y-1">
                    {example.useCases.map((useCase, i) => (
                      <li key={i} className="flex items-start">
                        <svg
                          className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
