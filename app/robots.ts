import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/**
 * Assistant and AI-search crawlers, allowed explicitly.
 *
 * The wildcard rule below already permits them, so this block changes no
 * behaviour today — it states the intent. Several of these agents (notably
 * Google-Extended and Applebot-Extended) govern whether the site can be used
 * to ground answers in AI search, and they are checked by name; a future
 * tightening of the wildcard rule would silently cut off assistant traffic
 * unless the intent is written down. People increasingly ask an assistant
 * "where can I rent a motorcycle in Morocco" rather than a search box, and
 * this site wants to be answerable.
 */
const AI_AGENTS = [
  // OpenAI: training, ChatGPT search index, and user-initiated browsing.
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  // Anthropic.
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  // Perplexity.
  'PerplexityBot',
  'Perplexity-User',
  // Google Gemini / AI Overviews grounding (separate from Googlebot).
  'Google-Extended',
  // Apple Intelligence / Siri grounding (separate from Applebot).
  'Applebot-Extended',
  // Meta AI.
  'meta-externalagent',
  // Common Crawl — the corpus behind many open models.
  'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  // Internals only. Nothing under a locale prefix is blocked.
  const disallow = ['/api/', '/_next/'];

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      { userAgent: AI_AGENTS, allow: '/', disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
