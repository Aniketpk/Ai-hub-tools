# Refactor file manifest

This inventory maps every tracked file moved during the refactor. Existing files in the frontend and backend source trees keep their relative paths. Files listed under “Migrated or replaced” were ported to the FastAPI service or replaced with safer configuration/scripts.

## Moved files

| Original path | New path |
| --- | --- |
| `AI_CHATBOT_ENHANCEMENTS.md` | `documentation/AI_CHATBOT_ENHANCEMENTS.md` |
| `AI_Hub_Agent.py` | `backend/AI_Hub_Agent.py` |
| `AI_INTEGRATION_GUIDE.md` | `documentation/AI_INTEGRATION_GUIDE.md` |
| `AI_UTILITIES_README.md` | `documentation/AI_UTILITIES_README.md` |
| `CODE_EXAMPLES.md` | `documentation/CODE_EXAMPLES.md` |
| `FINAL_CHECKLIST.md` | `documentation/FINAL_CHECKLIST.md` |
| `GOOGLE_AI_SETUP.md` | `documentation/GOOGLE_AI_SETUP.md` |
| `QUICK_REFERENCE.md` | `documentation/QUICK_REFERENCE.md` |
| `QUICK_START.md` | `documentation/QUICK_START.md` |
| `README.md` | `documentation/README.md` |
| `README_ORCHESTRATOR.md` | `documentation/README_ORCHESTRATOR.md` |
| `SETUP_COMPLETE.md` | `documentation/SETUP_COMPLETE.md` |
| `SETUP_PROGRESS.md` | `documentation/SETUP_PROGRESS.md` |
| `START_HERE.md` | `documentation/START_HERE.md` |
| `TROUBLESHOOTING.md` | `documentation/TROUBLESHOOTING.md` |
| `advanced_orchestrator.py` | `backend/advanced_orchestrator.py` |
| `agent_orchestrator.py` | `backend/agent_orchestrator.py` |
| `app/admin/loading.tsx` | `frontend/app/admin/loading.tsx` |
| `app/admin/page.tsx` | `frontend/app/admin/page.tsx` |
| `app/dashboard/page.tsx` | `frontend/app/dashboard/page.tsx` |
| `app/forgot-password/page.tsx` | `frontend/app/forgot-password/page.tsx` |
| `app/globals.css` | `frontend/app/globals.css` |
| `app/history/page.tsx` | `frontend/app/history/page.tsx` |
| `app/layout.tsx` | `frontend/app/layout.tsx` |
| `app/loading.tsx` | `frontend/app/loading.tsx` |
| `app/login/page.tsx` | `frontend/app/login/page.tsx` |
| `app/notes/page.tsx` | `frontend/app/notes/page.tsx` |
| `app/orchestrator/page.tsx` | `frontend/app/orchestrator/page.tsx` |
| `app/page.tsx` | `frontend/app/page.tsx` |
| `app/pricing/page.tsx` | `frontend/app/pricing/page.tsx` |
| `app/privacy/page.tsx` | `frontend/app/privacy/page.tsx` |
| `app/profile/page.tsx` | `frontend/app/profile/page.tsx` |
| `app/search/loading.tsx` | `frontend/app/search/loading.tsx` |
| `app/search/page.tsx` | `frontend/app/search/page.tsx` |
| `app/signup/page.tsx` | `frontend/app/signup/page.tsx` |
| `app/terms/page.tsx` | `frontend/app/terms/page.tsx` |
| `app/test-chatbot/page.tsx` | `frontend/app/test-chatbot/page.tsx` |
| `app/tools/[id]/page.tsx` | `frontend/app/tools/[id]/page.tsx` |
| `app/utilities/page.tsx` | `frontend/app/utilities/page.tsx` |
| `components.json` | `frontend/components.json` |
| `components/ai-motion.tsx` | `frontend/components/ai-motion.tsx` |
| `components/floating-chatbot.tsx` | `frontend/components/floating-chatbot.tsx` |
| `components/recommendation-section.tsx` | `frontend/components/recommendation-section.tsx` |
| `components/review-form.tsx` | `frontend/components/review-form.tsx` |
| `components/route-transition.tsx` | `frontend/components/route-transition.tsx` |
| `components/similar-tools.tsx` | `frontend/components/similar-tools.tsx` |
| `components/site-header.tsx` | `frontend/components/site-header.tsx` |
| `components/ui/accordion.tsx` | `frontend/components/ui/accordion.tsx` |
| `components/ui/alert-dialog.tsx` | `frontend/components/ui/alert-dialog.tsx` |
| `components/ui/alert.tsx` | `frontend/components/ui/alert.tsx` |
| `components/ui/aspect-ratio.tsx` | `frontend/components/ui/aspect-ratio.tsx` |
| `components/ui/avatar.tsx` | `frontend/components/ui/avatar.tsx` |
| `components/ui/badge.tsx` | `frontend/components/ui/badge.tsx` |
| `components/ui/breadcrumb.tsx` | `frontend/components/ui/breadcrumb.tsx` |
| `components/ui/button.tsx` | `frontend/components/ui/button.tsx` |
| `components/ui/calendar.tsx` | `frontend/components/ui/calendar.tsx` |
| `components/ui/card.tsx` | `frontend/components/ui/card.tsx` |
| `components/ui/carousel.tsx` | `frontend/components/ui/carousel.tsx` |
| `components/ui/chart.tsx` | `frontend/components/ui/chart.tsx` |
| `components/ui/checkbox.tsx` | `frontend/components/ui/checkbox.tsx` |
| `components/ui/collapsible.tsx` | `frontend/components/ui/collapsible.tsx` |
| `components/ui/command.tsx` | `frontend/components/ui/command.tsx` |
| `components/ui/context-menu.tsx` | `frontend/components/ui/context-menu.tsx` |
| `components/ui/dialog.tsx` | `frontend/components/ui/dialog.tsx` |
| `components/ui/drawer.tsx` | `frontend/components/ui/drawer.tsx` |
| `components/ui/dropdown-menu.tsx` | `frontend/components/ui/dropdown-menu.tsx` |
| `components/ui/form.tsx` | `frontend/components/ui/form.tsx` |
| `components/ui/hover-card.tsx` | `frontend/components/ui/hover-card.tsx` |
| `components/ui/input-otp.tsx` | `frontend/components/ui/input-otp.tsx` |
| `components/ui/input.tsx` | `frontend/components/ui/input.tsx` |
| `components/ui/label.tsx` | `frontend/components/ui/label.tsx` |
| `components/ui/menubar.tsx` | `frontend/components/ui/menubar.tsx` |
| `components/ui/navigation-menu.tsx` | `frontend/components/ui/navigation-menu.tsx` |
| `components/ui/pagination.tsx` | `frontend/components/ui/pagination.tsx` |
| `components/ui/popover.tsx` | `frontend/components/ui/popover.tsx` |
| `components/ui/progress.tsx` | `frontend/components/ui/progress.tsx` |
| `components/ui/radio-group.tsx` | `frontend/components/ui/radio-group.tsx` |
| `components/ui/resizable.tsx` | `frontend/components/ui/resizable.tsx` |
| `components/ui/scroll-area.tsx` | `frontend/components/ui/scroll-area.tsx` |
| `components/ui/select.tsx` | `frontend/components/ui/select.tsx` |
| `components/ui/separator.tsx` | `frontend/components/ui/separator.tsx` |
| `components/ui/sheet.tsx` | `frontend/components/ui/sheet.tsx` |
| `components/ui/sidebar.tsx` | `frontend/components/ui/sidebar.tsx` |
| `components/ui/skeleton.tsx` | `frontend/components/ui/skeleton.tsx` |
| `components/ui/slider.tsx` | `frontend/components/ui/slider.tsx` |
| `components/ui/sonner.tsx` | `frontend/components/ui/sonner.tsx` |
| `components/ui/switch.tsx` | `frontend/components/ui/switch.tsx` |
| `components/ui/table.tsx` | `frontend/components/ui/table.tsx` |
| `components/ui/tabs.tsx` | `frontend/components/ui/tabs.tsx` |
| `components/ui/textarea.tsx` | `frontend/components/ui/textarea.tsx` |
| `components/ui/toast.tsx` | `frontend/components/ui/toast.tsx` |
| `components/ui/toaster.tsx` | `frontend/components/ui/toaster.tsx` |
| `components/ui/toggle-group.tsx` | `frontend/components/ui/toggle-group.tsx` |
| `components/ui/toggle.tsx` | `frontend/components/ui/toggle.tsx` |
| `components/ui/tooltip.tsx` | `frontend/components/ui/tooltip.tsx` |
| `components/ui/use-mobile.tsx` | `frontend/components/ui/use-mobile.tsx` |
| `components/ui/use-toast.ts` | `frontend/components/ui/use-toast.ts` |
| `components/utilities/ai-chatbot.tsx` | `frontend/components/utilities/ai-chatbot.tsx` |
| `components/utilities/code-generator.tsx` | `frontend/components/utilities/code-generator.tsx` |
| `components/utilities/document-assistant.tsx` | `frontend/components/utilities/document-assistant.tsx` |
| `components/utilities/idea-generator.tsx` | `frontend/components/utilities/idea-generator.tsx` |
| `components/utilities/image-analyzer.tsx` | `frontend/components/utilities/image-analyzer.tsx` |
| `components/utilities/language-translator.tsx` | `frontend/components/utilities/language-translator.tsx` |
| `components/utilities/paster.tsx` | `frontend/components/utilities/paster.tsx` |
| `components/utilities/text-summarizer.tsx` | `frontend/components/utilities/text-summarizer.tsx` |
| `database.py` | `backend/database.py` |
| `database_helper.py` | `backend/database_helper.py` |
| `diagnose_network.py` | `backend/diagnose_network.py` |
| `gemma_model.py` | `backend/gemma_model.py` |
| `hooks/use-mobile.ts` | `frontend/hooks/use-mobile.ts` |
| `hooks/use-toast.ts` | `frontend/hooks/use-toast.ts` |
| `lib/auth-context.tsx` | `frontend/lib/auth-context.tsx` |
| `lib/paster-service.ts` | `frontend/lib/paster-service.ts` |
| `lib/recommendation-engine.ts` | `frontend/lib/recommendation-engine.ts` |
| `lib/tools-data.ts` | `frontend/lib/tools-data.ts` |
| `lib/utils.ts` | `frontend/lib/utils.ts` |
| `main.py` | `backend/main.py` |
| `mock_backend.py` | `backend/mock_backend.py` |
| `multimodal_engine.py` | `backend/multimodal_engine.py` |
| `next.config.mjs` | `frontend/next.config.mjs` |
| `openrouter_client.py` | `backend/openrouter_client.py` |
| `package-lock.json` | `frontend/package-lock.json` |
| `package.json` | `frontend/package.json` |
| `pnpm-lock.yaml` | `frontend/pnpm-lock.yaml` |
| `postcss.config.mjs` | `frontend/postcss.config.mjs` |
| `production_orchestrator.py` | `backend/production_orchestrator.py` |
| `public/ai-artwork.png` | `frontend/public/ai-artwork.png` |
| `public/ai-code-assistant.png` | `frontend/public/ai-code-assistant.png` |
| `public/ai-productivity-assistant.png` | `frontend/public/ai-productivity-assistant.png` |
| `public/ai-video-presenter.png` | `frontend/public/ai-video-presenter.png` |
| `public/ai-writing-assistant.png` | `frontend/public/ai-writing-assistant.png` |
| `public/placeholder-logo.png` | `frontend/public/placeholder-logo.png` |
| `public/placeholder-logo.svg` | `frontend/public/placeholder-logo.svg` |
| `public/placeholder-user.jpg` | `frontend/public/placeholder-user.jpg` |
| `public/placeholder-xoj99.png` | `frontend/public/placeholder-xoj99.png` |
| `public/placeholder.jpg` | `frontend/public/placeholder.jpg` |
| `public/placeholder.svg` | `frontend/public/placeholder.svg` |
| `public/tool-images/agenta.svg` | `frontend/public/tool-images/agenta.svg` |
| `public/tool-images/alaska-supreme.svg` | `frontend/public/tool-images/alaska-supreme.svg` |
| `public/tool-images/browsable.svg` | `frontend/public/tool-images/browsable.svg` |
| `public/tool-images/builderkit.svg` | `frontend/public/tool-images/builderkit.svg` |
| `public/tool-images/buzz-watch.svg` | `frontend/public/tool-images/buzz-watch.svg` |
| `public/tool-images/claude-3.svg` | `frontend/public/tool-images/claude-3.svg` |
| `public/tool-images/donny.svg` | `frontend/public/tool-images/donny.svg` |
| `public/tool-images/gpt4-turbo.svg` | `frontend/public/tool-images/gpt4-turbo.svg` |
| `public/tool-images/magic-patterns.svg` | `frontend/public/tool-images/magic-patterns.svg` |
| `public/tool-images/n8n.svg` | `frontend/public/tool-images/n8n.svg` |
| `public/tool-images/plot-travel.svg` | `frontend/public/tool-images/plot-travel.svg` |
| `public/tool-images/vulnox.svg` | `frontend/public/tool-images/vulnox.svg` |
| `scratch/test_multimodal.py` | `backend/scratch/test_multimodal.py` |
| `scripts/test-gemini.mjs` | `backend/scripts/test-gemini.mjs` |
| `skills-lock.json` | `documentation/skills-lock.json` |
| `skills/READY.md` | `documentation/skills/READY.md` |
| `styles/globals.css` | `frontend/styles/globals.css` |
| `test_gemini.py` | `backend/test_gemini.py` |
| `test_openrouter.py` | `backend/test_openrouter.py` |
| `tools_registry.py` | `backend/tools_registry.py` |
| `tsconfig.json` | `frontend/tsconfig.json` |

## Migrated or replaced

| Original path | Result |
| --- | --- |
| `app/api/ai-hub/route.ts` | `backend/main.py` implements its matching `/api/...` endpoint |
| `app/api/ai/analyze-image/route.ts` | `backend/main.py` implements its matching `/api/...` endpoint |
| `app/api/ai/chat/route.ts` | `backend/main.py` implements its matching `/api/...` endpoint |
| `app/api/ai/document/route.ts` | `backend/main.py` implements its matching `/api/...` endpoint |
| `app/api/ai/generate-code/route.ts` | `backend/main.py` implements its matching `/api/...` endpoint |
| `app/api/ai/generate-ideas/route.ts` | `backend/main.py` implements its matching `/api/...` endpoint |
| `app/api/ai/powerful-solve/route.ts` | `backend/main.py` implements its matching `/api/...` endpoint |
| `app/api/ai/summarize/route.ts` | `backend/main.py` implements its matching `/api/...` endpoint |
| `app/api/ai/translate/route.ts` | `backend/main.py` implements its matching `/api/...` endpoint |
| `.eslintrc.json` | `frontend/eslint.config.mjs` |
| `lib/ai-service.ts` | Backend AI endpoints and provider orchestration in `backend/main.py` |

The old root `README.md` is preserved at `documentation/README.md`; the new root `README.md` is the current onboarding and deployment guide. The former `fix_it.sh` was replaced by `frontend/scripts/clean-next-cache.sh`; `kill_backend.sh` was replaced by `backend/scripts/stop-backend.sh`. Newly created backend and frontend files are documented in the root README and summarized in the refactor report.
