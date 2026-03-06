# Atarax — A Stoic Journal

## Project Overview
A premium guided Stoic journaling web app. Clean, minimal, philosophical aesthetic.

## Design System
- Primary: #1C1C1C (charcoal)
- Accent: #C9A46C (muted gold)
- Background: #F7F5EF (parchment)
- Fonts: Playfair Display (headings), Inter (body)
- No border radius on cards — sharp edges only

## Tech Stack
- Vanilla HTML, CSS, JavaScript
- Supabase for database and authentication
- Supabase URL: https://pcfqrqbqwhhewkfzvtni.supabase.co
- Hosted on Netlify at https://atarax.netlify.app
- GitHub: https://github.com/hugoyu913-lab/atarax

## File Structure
- index.html — main app
- auth.html — login/signup page
- js/auth.js — Supabase auth utilities
- js/db.js — Supabase database reads/writes
- js/core.js — streak and core journal logic
- js/community.js — community reflections page
- js/challenge30.js — 30 day Stoic challenge
- js/ai.js — AI journaling companion
- js/mood.js — mood tracking
- js/pdf.js — PDF export
- js/extras.js — additional features

## Key Rules
- Always match the existing gold/parchment/charcoal design
- All data must save to Supabase, never localStorage
- Keep the app feeling premium, calm, and philosophical
- Every user only sees their own journal data
- Community page is shared and anonymous
