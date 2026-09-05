/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, ShieldAlert, Flag, ThumbsUp, Send, UserX, UserCheck, Check } from 'lucide-react';
import { localDb } from '../lib/localDb';
import { CommunityPost, UserRole } from '../types';

interface CommunityForumProps {
  userId: string;
  userDisplayName: string;
  userRole: UserRole;
}

export default function CommunityForum({ userId, userDisplayName, userRole }: CommunityForumProps) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Education');
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [flaggedPosts, setFlaggedPosts] = useState<string[]>([]);

  useEffect(() => {
    setPosts(localDb.getCommunityPosts());
  }, []);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    // Standard safety verification check
    const banRegex = /(attack|kill|revenge|terrorist|hang|die|destroy|harass|dox)/i;
    if (banRegex.test(title) || banRegex.test(content)) {
      alert("Flagged Content Security Alert: Your post contains words that violate the community peaceful safety principles. Girmaic Humanity does not promote violence or retaliation.");
      return;
    }

    const newPost: CommunityPost = {
      id: `p-${Date.now()}`,
      userId: userId || 'anonymous',
      userDisplayName: userDisplayName || 'Anonymous Advocate',
      userRole: userRole || UserRole.USER,
      category,
      title,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      flags: 0,
      isFlagged: false
    };

    localDb.saveCommunityPost(newPost);
    setPosts([newPost, ...posts]);
    setTitle('');
    setContent('');
  };

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, likes: p.likes + 1 };
        localDb.saveCommunityPost(updated);
        return updated;
      }
      return p;
    }));
  };

  const handleFlag = (id: string) => {
    setFlaggedPosts(prev => [...prev, id]);
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, flags: p.flags + 1, isFlagged: true };
        localDb.saveCommunityPost(updated);
        return updated;
      }
      return p;
    }));
  };

  const handleBlockUser = (authorId: string) => {
    if (!blockedUsers.includes(authorId)) {
      setBlockedUsers([...blockedUsers, authorId]);
    }
  };

  const handleUnblockUser = (authorId: string) => {
    setBlockedUsers(blockedUsers.filter(id => id !== authorId));
  };

  const filteredPosts = posts.filter(p => !blockedUsers.includes(p.userId));

  return (
    <div className="space-y-6" id="community-forum">
      <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-200/50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <MessageSquare className="h-5.5 w-5.5 text-emerald-600" />
            Respectful Community & Peaceful Action Forum
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Share personal experiences, discuss educational Human-Rights methods, and request templates for peaceful community petitions.
          </p>
        </div>
        <div className="flex gap-2 text-rose-800 dark:text-rose-405 text-[10px] bg-rose-50 dark:bg-rose-950/20 p-3 rounded-lg border border-rose-200/50 max-w-sm">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            <strong>Prohibited Actions:</strong> Threats, harassment, hate, doxxing, violence, extremist recruitment, revenge, targeted intimidation, malicious misinformation, fabricated evidence.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Post Form */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm h-fit">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-250 mb-4 pb-2 border-b border-slate-100">
            Start a Peaceful Dialogue
          </h3>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Dialogue Category</span>
              <select
                id="post-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100"
              >
                <option value="Education">Education & School Advocacy</option>
                <option value="Peaceful Advocacy">Peaceful Protest & Letters</option>
                <option value="Personal Experiences">Sharing Personal Experiences</option>
                <option value="Humanitarian Information">Humanitarian News</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Title</span>
              <input
                type="text"
                id="post-title"
                placeholder="Title of your dialogue..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Factual Context / Message</span>
              <textarea
                id="post-content"
                rows={4}
                placeholder="Discuss educational themes, raise peaceful support questions, write with empathy. Maximum civil respect..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
              ></textarea>
            </div>

            <button
              id="forum-submit-btn"
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-550 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Send className="h-4.5 w-4.5" /> Post Dialogue
            </button>
          </form>
        </div>

        {/* Posts feed */}
        <div className="lg:col-span-2 space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => {
              const isPostFlagged = flaggedPosts.includes(post.id);
              return (
                <div
                  key={post.id}
                  id={`post-card-${post.id}`}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-850 pb-3 mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-105 flex items-center justify-center text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-200">
                        {post.userDisplayName[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-150">{post.userDisplayName}</span>
                          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded uppercase">
                            {post.userRole}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5 block font-medium">
                          Posted {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-850 dark:text-slate-100 text-sm">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-350 mt-2.5 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="mt-5 pt-3 border-t border-slate-200/50 dark:border-slate-850 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        id={`post-like-btn-${post.id}`}
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1.5 text-xs text-slate-450 hover:text-emerald-600 transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span className="font-bold">{post.likes}</span>
                      </button>

                      <button
                        id={`post-flag-btn-${post.id}`}
                        onClick={() => handleFlag(post.id)}
                        disabled={isPostFlagged}
                        className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                          isPostFlagged
                            ? 'text-rose-500 font-bold'
                            : 'text-slate-450 hover:text-rose-500'
                        }`}
                        title="Flag inappropriate post"
                      >
                        <Flag className="h-4 w-4" />
                        <span className="font-semibold">{isPostFlagged ? 'Reported' : 'Flag'}</span>
                      </button>
                    </div>

                    {post.userId !== userId && (
                      <button
                        id={`post-block-btn-${post.id}`}
                        onClick={() => handleBlockUser(post.userId)}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Block this user from my view"
                      >
                        <UserX className="h-3.5 w-3.5" /> Block User
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center">
              <MessageSquare className="h-12 w-12 text-slate-200 dark:text-slate-800 mx-auto mb-3" />
              <p className="text-xs text-slate-400">No active discussions matching filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
