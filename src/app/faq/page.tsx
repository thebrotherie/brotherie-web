'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link'


interface FAQ {
  id: number;
  question: string;
  answer: string;
  section: string;
  created_at: string;
  updated_at: string;
}

interface GroupedFAQs {
  [section: string]: FAQ[];
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<GroupedFAQs>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [openQuestions, setOpenQuestions] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('section', { ascending: true })
        .order('id', { ascending: true });

      if (error) throw error;

      // Group FAQs by section
      const groupedFAQs: GroupedFAQs = (data || []).reduce((acc: GroupedFAQs, faq: FAQ) => {
        if (!acc[faq.section]) {
          acc[faq.section] = [];
        }
        acc[faq.section].push(faq);
        return acc;
      }, {});

      setFaqs(groupedFAQs);
      
      // Set first section as active by default
      const firstSection = Object.keys(groupedFAQs)[0];
      if (firstSection) {
        setActiveSection(firstSection);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (questionId: number) => {
    const newOpenQuestions = new Set(openQuestions);
    if (newOpenQuestions.has(questionId)) {
      newOpenQuestions.delete(questionId);
    } else {
      newOpenQuestions.add(questionId);
    }
    setOpenQuestions(newOpenQuestions);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">FAQ</h1>
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">Error loading FAQs: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sections = Object.keys(faqs);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our small-batch bone broth delivery service.
          </p>
        </div>

        {sections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No FAQs available yet.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Section Navigation */}
            <div className="lg:w-1/4">
              <div className="sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Categories
                </h2>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section}
                      onClick={() => setActiveSection(section)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        activeSection === section
                          ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {section}
                      <span className="ml-2 text-sm text-gray-400">
                        ({faqs[section].length})
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* FAQ Content */}
            <div className="lg:w-3/4">
              {activeSection && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {activeSection}
                  </h2>
                  <div className="space-y-4">
                    {faqs[activeSection].map((faq: FAQ) => (
                      <div
                        key={faq.id}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(faq.id)}
                          className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
                        >
                          <h3 className="font-semibold text-gray-900 pr-4">
                            {faq.question}
                          </h3>
                          <svg
                            className={`w-5 h-5 text-gray-500 transition-transform ${
                              openQuestions.has(faq.id) ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {openQuestions.has(faq.id) && (
                          <div className="px-6 py-4 bg-white border-t border-gray-200">
                            <div className="prose prose-sm max-w-none text-gray-700">
                              {faq.answer.split('\n').map((paragraph: string, index: number) => (
                                <p key={index} className="mb-2 last:mb-0">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional CTA */}
          <div className="text-center mt-12 pt-8 border-t border-emerald-200">
            <p className="text-gray-600 mb-3">
              Still have more questions?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-emerald-700 font-medium hover:text-emerald-800 transition-colors"
            >
              Get in touch with us
              <span>→</span>
            </Link>
          </div>

      </div>
    </div>
  );
}