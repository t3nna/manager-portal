# Manager Portal implementation plan

## Confirmed scope

This first release is a no-auth, no-database manager portal. Managers can create multiple projects in the current browser session, choose the single initial template (`3716_offer_archive`), edit plain-text fields, reorder editable main blocks (including the registration-form block), preview the result, and download an HTML document with all page CSS inline.

The following decisions are fixed for v1:

- Project data is stored in browser `sessionStorage`. It survives refreshes in the same browser session but is not durable or shared across browsers/devices.
- Editing happens through an editor panel beside a live preview; direct WYSIWYG editing inside the preview is out of scope.
- Header, navigation, footer, and any template aside are locked. Only the content fields declared by the template are editable. The aside may expose fixed, plain-text fields but cannot be moved or structurally changed.
- Text fields accept plain text only. No rich-text markup, arbitrary HTML, custom links, or style editing are included.
- The registration form is visual only. It must not submit data or reference `send.php`, `form-kit`, or a third-party endpoint.
- Export is one `.html` file with inline styles. Images are not embedded in the HTML file. The initial release uses placeholders; a later image feature will use fixed named slots such as `00.jpg` rather than choosing an arbitrary available slot.
- Authentication and authorization are explicitly out of scope for this phase.

## Current architecture and integration points

The repository is an unmodified Next.js starter:

- Next.js 16.3.6 App Router, React 19.2, strict TypeScript, and Tailwind CSS v4.
- The only product route is `/`, implemented by `app/page.tsx`; `app/layout.tsx` owns the global document shell and fonts.
- There are no project routes, API handlers, storage adapters, tests, shadcn/ui setup, or drag-and-drop dependencies.
- `package.json` contains no test scripts or editor dependencies.
- `templates/` is untracked source material and has no runtime mapping to `public/` or the app.

`3716_offer_archive` is a reference archive, not an executable web template. It contains a PHP guard, ten main sections, a static header/navigation/footer, relative CSS/assets, and a JavaScript-injected lead form that posts to `form-kit/send.php`. Its PHP, source scripts, lead form, and submission endpoint must not run in the portal, preview, or export.

`npm run lint` currently fails because ESLint scans third-party JavaScript inside `templates/` (128 errors and 854 warnings). Linting only `app/` succeeds. The portal should ignore the source archive directory while keeping normal application files fully linted.

## Proposed architecture

Use a typed, template-specific renderer. Do not parse or execute PHP/HTML archive content at runtime.

```text
Session project state
  ├─ id, name, template ID, schema version
  ├─ editable plain-text values
  └─ ordered editable block IDs

Template definition: trader-3716
  ├─ locked shell: header, nav, footer
  ├─ optional locked aside configuration
  ├─ ten editable main blocks and one form block
  ├─ fixed text-field registry and default values
  ├─ template CSS and placeholder rules
  └─ renderer shared by preview and export
```

Recommended routes:

```text
/                         Project dashboard
/projects/new             Project name and template choice
/projects/[projectId]     Editor panel, ordering controls, live preview, export
/api/export               Stateless POST endpoint returning an HTML attachment
```

### Project model

```ts
type Project = {
  schemaVersion: 1;
  id: string;
  name: string;
  templateId: "trader-3716";
  content: Record<FieldId, string>;
  blockOrder: BlockId[];
};
```

The store validates data read from `sessionStorage` and discards malformed or obsolete entries safely. It owns project creation, rename, update, ordering, deletion, and session hydration. Stable block and field IDs—not display labels or array positions—are the compatibility contract for future persistence.

### Template model and rendering contract

The template definition must explicitly declare:

- Stable block IDs, labels, default order, and whether each block is movable.
- Every editable plain-text field, including the form's name, surname, email, phone, and submit labels.
- The locked header/navigation/footer and any locked aside text fields.
- A template-specific markup renderer and its CSS source.

The renderer accepts only a validated `Project` and produces a complete HTML document. It HTML-escapes every editable value, preserves the template's own DOM classes and layout rules, and renders reordered blocks only inside the permitted `<main>` slot. It must never accept raw HTML as a value.

The manager preview is an iframe with `srcDoc`, isolated from portal CSS. It uses the same compiler as download generation, with only preview-specific block highlighting added. Source template JavaScript is never inserted. This is the primary protection against CSS leakage and preview/export drift.

The source archive's images will be replaced by generated, accessible placeholder elements in v1. The export therefore has no external stylesheets, PHP, form scripts, or image files. A later image implementation will map fixed slot IDs to fixed filenames (for example, an agreed hero slot may output `00.jpg`); those image assets remain separate from the exported `.html` file.

### Export contract

`POST /api/export` receives a versioned project document, validates it against the catalog, compiles the static document, and returns:

- `Content-Type: text/html; charset=utf-8`
- An attachment filename based on a sanitized project name
- The same ordered blocks, text values, CSS, and placeholders as the preview

It stores nothing. The client converts the response to a Blob and triggers the browser download. The output form uses inert behavior and no submission action; it must not imply that lead data will be processed.

### UI implementation

Use shadcn/ui for the portal frame, dialogs, inputs, labels, buttons, cards, sheets/tooltips, and accessible feedback. Use `@dnd-kit` for reordering, supplemented by visible keyboard move-up/move-down actions so pointer use is never required.

The editor page contains:

1. Project name and template identity.
2. A block list limited to permitted main blocks, including the form block.
3. A field inspector for the selected block, rendering ordinary text inputs/textareas.
4. Responsive preview controls and the isolated live preview.
5. An export action and an explicit session-only notice.

Navigation/footer controls never appear in the reorder list. The aside, if represented by the selected template, remains in its template position; only its explicitly declared text values may be edited.

## Alternatives considered

| Option | Benefits | Drawbacks | Decision |
| --- | --- | --- | --- |
| Execute/parse the supplied PHP archive | Superficially quick reuse | PHP cannot run safely in the app; scripts, tracking, and hidden backend behaviour would leak; content selection is unreliable | Reject |
| Render template CSS in the portal DOM | Simpler direct interaction | Global styles can break the manager UI and future templates | Reject |
| Typed renderer plus isolated iframe | Safe CSS isolation, predictable text model, preview/export parity | Requires a deliberate one-time adaptation of the template | Use |
| In-memory projects only | Strictest no-storage option | Projects disappear on refresh | Reject |
| `sessionStorage` project repository | Refresh-safe within a browser session; no backend/database | Not durable or shareable | Use |
| Client-only Blob export | No API request | Duplicates compile/validation code and omits the requested export endpoint | Fallback only |
| Stateless Next.js route handler | One validated compiler and a standard file response | Needs request-size/shape validation | Use |

## Dependency-ordered implementation slices

### Slice 1 — Foundation and quality gate

Create the portal baseline without delivering business logic yet.

- Initialize shadcn/ui and add the required shared primitives.
- Add Vitest, React Testing Library, Playwright, and `test`/`test:e2e` scripts.
- Update ESLint to ignore only `templates/**`, not portal code.
- Replace starter metadata and global styling with the manager portal shell.

Acceptance tests:

- `npm run lint` exits successfully and lints portal source files.
- `npm run test -- --run` passes a portal-shell smoke test.
- `npm run build` exits successfully.
- A Playwright portal-shell test finds the dashboard heading at `/`.

### Slice 2 — Versioned project state and dashboard

Make multi-project session workflow real.

- Define the `Project`, template catalog, block-order, and schema-version contracts.
- Implement a defensive `sessionStorage` repository and project provider.
- Build dashboard cards, create-project dialog/page, template selection, empty state, and session-only disclosure.
- Add `/projects/new` and `/projects/[projectId]` routes; the editor route may initially show a loading/placeholder shell.

Acceptance tests:

- Unit tests cover create, rename, list, delete, hydration after refresh, and rejection of malformed session data.
- Playwright creates two projects, sees both on the dashboard, opens each correct project route, and retains them after browser-page refresh.
- A project with a missing/invalid ID receives an understandable not-found state rather than throwing.

### Slice 3 — Safe static-document compiler

Establish the single rendering contract before building the complete template adaptation.

- Define `TemplateDefinition`, block field registries, document AST/string serializer, escaping helpers, and project validator.
- Implement inline-CSS assembly and generic accessible image placeholders.
- Implement a preview document mode with only trusted editor highlighting.
- Add catalog validation that rejects unknown templates, fields, and block IDs.

Acceptance tests:

- Values such as `<img src=x onerror=alert(1)>` render as literal text, never markup.
- Compiled output has exactly one `<!doctype html>`, inline `<style>`, and no external stylesheet links or source scripts.
- Compiler tests reject unknown template IDs, field IDs, duplicate/missing block IDs, and unsupported schema versions.
- Output contains no `<?php`, `send.php`, `form-kit`, or tracking-script references.

### Slice 4 — Adapt `3716_offer_archive` as the first selectable template

Deliver the first complete, safe template.

- Translate the static header/navigation/footer and all ten main sections into a `trader-3716` template definition.
- Create a native visual registration-form block with editable name, surname, email, phone, and button labels; no submit behavior/action.
- Preserve intended layout through template-owned markup and CSS, replacing source imagery with placeholders.
- Declare any aside as locked with only approved text fields exposed to the field registry.

Acceptance tests:

- Definition tests assert the expected ten main blocks, form block, default order, and every declared editable field exactly once.
- Locked navigation/footer and structure never occur in the reorderable block collection.
- A template preview test verifies the default document uses placeholders and contains no source archive JavaScript/PHP behaviour.
- Desktop and mobile Playwright visual snapshots match an approved placeholder baseline.

### Slice 5 — Editor panel and accessible ordering

Make the template manager-editable.

- Build the field inspector and selected-block state.
- Wire plain-text field edits into session project state and live iframe preview.
- Add pointer drag-and-drop plus keyboard move controls for only allowed main blocks.
- Add responsive preview sizes, focused-block highlighting, project rename, and disabled/no-op form feedback.

Acceptance tests:

- Playwright changes a heading, paragraph, and all five registration labels/button text; each update appears in the preview.
- Playwright moves a section with keyboard controls and with drag-and-drop; preview order updates identically.
- After refresh, project text and block order restore from `sessionStorage`.
- Navigation, footer, and locked aside are not reorderable; attempts to reorder them are impossible through the UI and rejected by the model validator.
- The editor can be completed with keyboard navigation, and controls have accessible names.

### Slice 6 — Stateless export and browser download

Produce the requested final artifact.

- Implement `POST /api/export` using the shared validator/compiler.
- Enforce JSON content type, bounded payload size, field-length limits, and a safe attachment filename.
- Add client download handling and failure feedback.
- Ensure export removes all preview-only highlighting/editor metadata.

Acceptance tests:

- Endpoint returns `400` for malformed project data and unknown templates, `413` for over-limit payloads, and `200` for valid input.
- Valid responses use `text/html; charset=utf-8` and an attachment `Content-Disposition` header.
- An exported document test verifies edited text, form labels, block order, inline CSS, no external stylesheet/script/PHP/form-handler references, and no preview controls.
- Playwright triggers export and asserts the downloaded filename ends in `.html` and contains the expected document.

### Slice 7 — Deferred fixed image slots

This is intentionally after the functional v1.

- Add an explicit per-template image-slot manifest such as `hero-image -> 00.jpg`; slot names are fixed rather than inferred from order.
- Validate upload name, MIME type, dimensions, and size in the browser session.
- Preview image selections using session-lifetime object URLs.
- Export fixed relative filenames, such as `00.jpg`, without embedding image bytes in the HTML.

Acceptance tests:

- Only manifest-defined filenames from `00.jpg` through `99.jpg` are accepted.
- Unknown, duplicate, invalid-type, and oversized uploads are rejected with a visible error.
- Selected image previews render in their assigned fixed slot.
- Export contains the agreed relative image filename and does not contain base64 image data.

## Risk register and rollout

| Risk | Mitigation |
| --- | --- |
| Session data is lost when the browser session ends | State this clearly in the interface; keep a versioned model so a database adapter can later replace the session adapter. |
| Text injection/XSS | Plain text only; escape output centrally; validate again in `/api/export`; no raw HTML fields. |
| Source archive scripts/PHP cause privacy or security harm | Treat the archive only as visual source; exclude PHP, tracking, `send.php`, third-party scripts, and lead-form code from all deliverables. |
| Registration form appears functional | Render it as visual-only and expose no endpoint/action. Add submission integration only as a separate, authorized project. |
| Reordering breaks CSS | Reorder only explicit blocks inside the main slot; adapters own their DOM/CSS; use template snapshot tests. |
| CSS escapes into the manager portal | Render preview in a sandboxed iframe and inline only trusted, adapted CSS. |
| Large export later due to images/fonts | V1 uses placeholders and excludes image bytes. Before adding assets, establish file-size limits and hosting requirements. |
| Future persistence incompatibility | Preserve `schemaVersion`, template ID, stable block IDs, and stable field IDs from the first release. |
| Brand/content rights | Confirm rights to the archive's brand-like visuals, copy, imagery, and fonts before production release. |
| No auth | This is acceptable only for the agreed phase. Do not expose a production manager portal publicly without a future authentication/authorization slice. |

## Explicitly out of scope for v1

- Additional source templates.
- Persistent database storage, collaboration, history, or cross-device projects.
- Authentication and authorization.
- Rich text, arbitrary HTML, style/color editing, and editable navigation/footer structure.
- Functional form submission, CRM integration, analytics, tracking, CAPTCHA, and server-side lead handling.
- Image upload and image embedding in exported HTML.
