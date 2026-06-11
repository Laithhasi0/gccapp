---
name: RSC icon serialization across client boundary
description: Why passing Lucide (function-component) icons into a client component throws, and the server-component fix.
---

# Lucide icons cannot cross the server→client RSC boundary

Data objects that carry a React component reference (e.g. `service.icon = Smartphone` from lucide-react) must NOT be passed from a Server Component into a Client Component. Doing so throws at render time: "Functions cannot be passed directly to Client Components" / "Only plain objects can be passed to Client Components" — the page 500s and renders `<html id="__next_error__">`.

**Why:** RSC serializes props across the boundary; function components are not serializable. The icon field is a live function reference.

**How to apply:** Components that consume an icon-bearing object (ServiceCard, service detail, capabilities, etc.) should stay Server Components. When such a component also needs localized UI strings, make it an **async Server Component** and call `getUI(await getLocale())` instead of the client `useI18n()` hook. That keeps the icon server-side and still gives per-request locale. Server components nest fine as children of client wrappers (e.g. inside `<Reveal>`), because they're rendered on the server first.

For genuinely interactive (client) components that need an icon, pass a pre-rendered element/ReactNode, or pass a string key and map it to the component on the client — never the function itself.
