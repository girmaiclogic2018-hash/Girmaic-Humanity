/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Bookmark, BookmarkCheck, ExternalLink, Calendar, CheckCircle, Scale, Globe, Printer, Download, Volume2, VolumeX } from 'lucide-react';
import { rightsArticles } from '../data/rightsArticles';
import { localDb } from '../lib/localDb';
import { RightsArticle } from '../types';

interface RightsLibraryProps {
  currentLang: string;
}

export default function RightsLibrary({ currentLang }: RightsLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<RightsArticle | null>(null);

  // Text-to-Speech (TTS) States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handleToggleTTS = (article: RightsArticle) => {
    if (!synthRef.current) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    } else {
      const title = article.multilingual[currentLang]?.title || article.title;
      const summary = article.multilingual[currentLang]?.summary || article.summary;
      const explanation = article.multilingual[currentLang]?.fullExplanation || article.fullExplanation;

      // Construct clean narrative text
      const speakText = `${title}. Core Summary: ${summary}. Full legal explanation: ${explanation}`;

      const utterance = new SpeechSynthesisUtterance(speakText);
      utterance.lang = currentLang === 'en' ? 'en-US' :
                       currentLang === 'fr' ? 'fr-FR' :
                       currentLang === 'ar' ? 'ar-SA' :
                       currentLang === 'am' ? 'am-ET' : 'en-US';

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.cancel(); // stop any current audio
      synthRef.current.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Stop TTS if user switches articles
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, [selectedArticle]);

  const handlePrintArticle = (article: RightsArticle) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const title = article.multilingual[currentLang]?.title || article.title;
    const summary = article.multilingual[currentLang]?.summary || article.summary;
    const explanation = article.multilingual[currentLang]?.fullExplanation || article.fullExplanation;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - GIRMAIC HUMANITY Printable Guide</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              color: #1e293b;
              line-height: 1.6;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              border-bottom: 2px solid #059669;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .brand {
              font-size: 24px;
              font-weight: 800;
              color: #047857;
              text-transform: uppercase;
              letter-spacing: -0.5px;
            }
            .meta-badge {
              font-size: 11px;
              font-weight: 700;
              background: #f0fdf4;
              border: 1px solid #bbf7d0;
              color: #166534;
              padding: 4px 10px;
              border-radius: 9999px;
              text-transform: uppercase;
            }
            h1 {
              font-size: 28px;
              font-weight: 800;
              color: #0f172a;
              margin-bottom: 15px;
              line-height: 1.2;
            }
            .summary-box {
              background: #f8fafc;
              border-left: 4px solid #10b981;
              padding: 15px;
              border-radius: 0 8px 8px 0;
              margin-bottom: 25px;
            }
            .summary-title {
              font-size: 12px;
              font-weight: 700;
              color: #047857;
              text-transform: uppercase;
              margin-bottom: 5px;
            }
            .explanation {
              font-size: 14px;
              white-space: pre-wrap;
              color: #334155;
            }
            .footer {
              border-top: 1px solid #e2e8f0;
              margin-top: 50px;
              padding-top: 20px;
              font-size: 10px;
              color: #64748b;
              text-align: center;
            }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">GIRMAIC HUMANITY</div>
            <div class="meta-badge">${article.category}</div>
          </div>
          <h1>${title}</h1>
          <div class="summary-box">
            <div class="summary-title">Core Summary</div>
            <div>${summary}</div>
          </div>
          <div class="explanation">
            <h3>Full Legal & Educational Explanation</h3>
            ${explanation}
          </div>
          <div class="footer">
            <p>© 2026 GIRMAIC HUMANITY — Dire Dawa, Ethiopia. Founder: Girma Haile Bunaro. Verified Secure Document.</p>
            <p>Source Covenant: ${article.source} | Jurisdiction: ${article.jurisdiction}</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportOfflineDoc = (article: RightsArticle) => {
    const title = article.multilingual[currentLang]?.title || article.title;
    const summary = article.multilingual[currentLang]?.summary || article.summary;
    const explanation = article.multilingual[currentLang]?.fullExplanation || article.fullExplanation;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title} - GIRMAIC HUMANITY Offline Guide</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              color: #0f172a;
              background-color: #f8fafc;
              line-height: 1.6;
              padding: 24px;
              margin: 0;
            }
            .card {
              background-color: #ffffff;
              max-width: 700px;
              margin: 40px auto;
              padding: 32px;
              border-radius: 16px;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
              border: 1px solid #e2e8f0;
            }
            .brand-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px solid #059669;
              padding-bottom: 16px;
              margin-bottom: 24px;
            }
            .brand-name {
              font-size: 20px;
              font-weight: 800;
              color: #047857;
              letter-spacing: -0.5px;
            }
            .badge {
              font-size: 10px;
              font-weight: 700;
              background: #f0fdf4;
              border: 1px solid #bbf7d0;
              color: #166534;
              padding: 4px 8px;
              border-radius: 9999px;
              text-transform: uppercase;
            }
            h1 {
              font-size: 24px;
              font-weight: 800;
              color: #0f172a;
              margin-top: 0;
              margin-bottom: 12px;
            }
            .summary {
              background: #f0fdf4;
              border-left: 4px solid #10b981;
              padding: 16px;
              border-radius: 0 8px 8px 0;
              margin-bottom: 24px;
            }
            .summary-title {
              font-size: 11px;
              font-weight: 700;
              color: #047857;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .explanation {
              font-size: 13px;
              color: #334155;
              white-space: pre-wrap;
            }
            .author-box {
              background-color: #f1f5f9;
              border-radius: 12px;
              padding: 16px;
              margin-top: 32px;
              font-size: 11px;
            }
            .author-title {
              font-weight: 800;
              color: #0f172a;
              text-transform: uppercase;
              margin-bottom: 6px;
            }
            .footer {
              text-align: center;
              font-size: 10px;
              color: #64748b;
              margin-top: 32px;
              border-top: 1px solid #e2e8f0;
              padding-top: 16px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="brand-header">
              <span class="brand-name">GIRMAIC HUMANITY</span>
              <span class="badge">${article.category}</span>
            </div>
            <h1>${title}</h1>
            <div class="summary">
              <div class="summary-title">Official Brief</div>
              <p style="margin: 0; font-size: 12px; color: #1e293b;">${summary}</p>
            </div>
            <h3>Legal & Educational Overview</h3>
            <div class="explanation">${explanation}</div>
            
            <div class="author-box">
              <div class="author-title">Platform Verification & Contacts</div>
              <p style="margin: 0 0 4px 0;"><strong>Founder & Visionary</strong>: Girma Haile Bunaro</p>
              <p style="margin: 0 0 4px 0;"><strong>Origin</strong>: Dire Dawa, Ethiopia</p>
              <p style="margin: 0;"><strong>Support Emails</strong>: girmahb1979@gmail.com | girmaiclogic2018@gmail.com</p>
            </div>

            <div class="footer">
              <p>Generated Securely by GIRMAIC HUMANITY on ${new Date().toLocaleDateString()}</p>
              <p>Source Covenant: ${article.source} | Jurisdiction: ${article.jurisdiction}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Girmaic_Humanity_Rights_Article_${article.id}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    setBookmarks(localDb.getBookmarks());
  }, []);

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarks.includes(id)) {
      localDb.removeBookmark(id);
      setBookmarks(bookmarks.filter(b => b !== id));
    } else {
      localDb.saveBookmark(id);
      setBookmarks([...bookmarks, id]);
    }
  };

  const categories = ['all', 'Equality', 'Freedom of expression', 'Due process', 'Digital rights'];

  const filteredArticles = rightsArticles.filter(art => {
    const translation = art.multilingual[currentLang] || { title: art.title, summary: art.summary };
    const titleText = translation.title.toLowerCase();
    const summaryText = translation.summary.toLowerCase();
    const categoryText = art.category.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = titleText.includes(query) || summaryText.includes(query) || categoryText.includes(query);
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6" id="rights-library">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            id="rights-search-input"
            placeholder="Search by keywords or category name (e.g. Due process)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              id={`rights-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Rights' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Articles List */}
        <div className="lg:col-span-1 space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(art => {
              const translation = art.multilingual[currentLang] || { title: art.title, summary: art.summary };
              const isBookmarked = bookmarks.includes(art.id);
              return (
                <div
                  key={art.id}
                  id={`rights-art-${art.id}`}
                  onClick={() => setSelectedArticle(art)}
                  className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                    selectedArticle?.id === art.id
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-400 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-350'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50">
                      {art.category}
                    </span>
                    <button
                      id={`rights-bookmark-btn-${art.id}`}
                      onClick={(e) => handleToggleBookmark(art.id, e)}
                      className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      {isBookmarked ? <BookmarkCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" /> : <Bookmark className="h-4.5 w-4.5" />}
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-800 dark:text-slate-100 mt-2 line-clamp-1">
                    {translation.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {translation.summary}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 text-center">
              <Scale className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No matching rights articles found.</p>
            </div>
          )}
        </div>

        {/* Article Full Explanation Frame */}
        <div className="lg:col-span-2">
          {selectedArticle ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[450px]" id="rights-article-viewer">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                      {selectedArticle.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mr-2">
                      <Scale className="h-3.5 w-3.5" /> {selectedArticle.jurisdiction}
                    </span>
                    
                    <button
                      id="rights-print-btn"
                      onClick={() => handlePrintArticle(selectedArticle)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-750 dark:text-slate-300 hover:bg-slate-100 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                      title="Print article safely"
                    >
                      <Printer className="h-3 w-3 text-slate-500" />
                      <span>Print Guide</span>
                    </button>

                    <button
                      id="rights-export-btn"
                      onClick={() => handleExportOfflineDoc(selectedArticle)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-750 dark:text-slate-300 hover:bg-slate-100 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                      title="Download offline-ready printable HTML guide"
                    >
                      <Download className="h-3 w-3 text-slate-500" />
                      <span>Offline Guide Export</span>
                    </button>

                    {/* Text-to-Speech legal narration tool */}
                    <button
                      id="rights-tts-btn"
                      onClick={() => handleToggleTTS(selectedArticle)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold cursor-pointer transition-all border ${
                        isSpeaking
                          ? 'bg-rose-500 border-rose-500 text-white animate-pulse'
                          : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/50'
                      }`}
                      title={isSpeaking ? "Stop Narration" : "Read Legal Article Aloud"}
                      aria-label={isSpeaking ? "Stop reading article text aloud" : "Start voice text to speech narration"}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="h-3 w-3" />
                          <span>Stop Narration</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3 w-3" />
                          <span>Audio Narrator</span>
                        </>
                      )}
                    </button>
                  </div>
                  <button
                    id="rights-view-bookmark-btn"
                    onClick={(e) => handleToggleBookmark(selectedArticle.id, e)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    {bookmarks.includes(selectedArticle.id) ? (
                      <>
                        <BookmarkCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Bookmarked
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4" /> Bookmark Article
                      </>
                    )}
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {selectedArticle.multilingual[currentLang]?.title || selectedArticle.title}
                </h2>

                <div className="bg-emerald-50/30 dark:bg-emerald-950/10 border-l-4 border-emerald-500 rounded-r-lg p-4">
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">Core Summary</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {selectedArticle.multilingual[currentLang]?.summary || selectedArticle.summary}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Full Educational Explanation</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed whitespace-pre-wrap">
                    {selectedArticle.multilingual[currentLang]?.fullExplanation || selectedArticle.fullExplanation}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px]">
                <div className="space-y-1">
                  <span className="text-slate-400 block uppercase">Source</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    {selectedArticle.source}
                    {selectedArticle.sourceUrl && (
                      <a href={selectedArticle.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600">
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block uppercase">Jurisdiction</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedArticle.jurisdiction}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block uppercase">Last Reviewed</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" /> {selectedArticle.lastReviewed}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block uppercase">Review Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Verified Content
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[450px]">
              <Scale className="h-16 w-16 text-slate-200 dark:text-slate-800 mb-4" />
              <h3 className="font-bold text-slate-700 dark:text-slate-300">Know Your Human Rights</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                Knowledge is the greatest safeguard against tyranny and injustice. Select a rights covenant from the list to explore explanations, legal jurisdictions, and official resources.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
