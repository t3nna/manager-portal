import { PROJECT_TEMPLATE_ID, type BlockId } from "@/lib/project-schema";
import { element as h, text, type HtmlNode } from "@/lib/templates/html";
import { trader3716PreviewStyles, trader3716Styles } from "@/lib/templates/trader-3716.css";
import type { BlockDefinition, FieldDefinition, TemplateDefinition, TemplateRenderContext } from "@/lib/templates/types";

const blocks: readonly BlockDefinition[] = [
  { id: "hero", label: "Hero", movable: true }, { id: "press", label: "Featured publications", movable: true },
  { id: "experts", label: "Trusted voices", movable: true }, { id: "testimonials-primary", label: "Member experiences", movable: true },
  { id: "calculator", label: "Illustrative calculator", movable: true }, { id: "how-it-works", label: "How it works", movable: true },
  { id: "testimonials-secondary", label: "Member story", movable: true }, { id: "statistics", label: "Statistics", movable: true },
  { id: "testimonials-community", label: "Community voices", movable: true }, { id: "final-cta", label: "Final call to action", movable: true },
  { id: "registration-form", label: "Registration form", movable: true },
];

const field = (blockId: BlockId, id: string, label: string, defaultValue: string, kind: "input" | "textarea" = "input"): FieldDefinition => ({ id, blockId, label, defaultValue, kind });
const fields: readonly FieldDefinition[] = [
  field("hero", "hero-eyebrow", "Eyebrow", "Digital asset investing · Australia"),
  field("hero", "hero-title", "Heading", "A considered approach to digital wealth.", "textarea"),
  field("hero", "hero-copy", "Description", "Trader gives Australian investors a clear, measured way to explore digital asset markets with transparent reporting and disciplined strategy.", "textarea"),
  field("hero", "hero-cta", "Button label", "Explore the approach"),
  field("hero", "hero-trust-1-value", "Trust item 1 value", "5+ yrs"), field("hero", "hero-trust-1-label", "Trust item 1 label", "In operation"),
  field("hero", "hero-trust-2-value", "Trust item 2 value", "Clear"), field("hero", "hero-trust-2-label", "Trust item 2 label", "Reporting"),
  field("hero", "hero-trust-3-value", "Trust item 3 value", "AUD"), field("hero", "hero-trust-3-label", "Trust item 3 label", "Illustrations shown"),
  field("registration-form", "form-title", "Heading", "Open your account"), field("registration-form", "form-lead", "Description", "Take a moment to review the details. This preview does not submit information.", "textarea"),
  field("registration-form", "form-name-label", "Name label", "First name"), field("registration-form", "form-surname-label", "Surname label", "Last name"),
  field("registration-form", "form-email-label", "Email label", "Email address"), field("registration-form", "form-phone-label", "Phone label", "Phone number"),
  field("registration-form", "form-submit", "Button label", "Continue"), field("registration-form", "form-note", "Consent note", "Preview only — no details are sent or stored.", "textarea"),
  field("press", "press-eyebrow", "Eyebrow", "Featured in"), field("press", "press-title", "Heading", "Recognized by leading publications.", "textarea"),
  ...Array.from({ length: 6 }, (_, index) => field("press", `press-logo-${index + 1}`, `Publication placeholder ${index + 1}`, `Publication ${index + 1}`)),
  field("experts", "experts-eyebrow", "Eyebrow", "Trusted voices"), field("experts", "experts-title", "Heading", "People who value a thoughtful approach.", "textarea"),
  ...["one", "two"].flatMap((key, index) => [
    field("experts", `expert-${key}-placeholder`, `Expert ${index + 1} placeholder`, "Portrait placeholder"),
    field("experts", `expert-${key}-quote`, `Expert ${index + 1} quote`, index === 0 ? "“The strongest investment conversations are clear about uncertainty, process, and individual circumstances.”" : "“A balanced plan starts with good questions, transparent information, and time to decide.”", "textarea"),
    field("experts", `expert-${key}-name`, `Expert ${index + 1} name`, index === 0 ? "Alex Morgan" : "Jordan Lee"),
    field("experts", `expert-${key}-role`, `Expert ${index + 1} role`, index === 0 ? "Investment educator" : "Portfolio specialist"),
  ]),
  field("testimonials-primary", "primary-eyebrow", "Eyebrow", "Member experiences"), field("testimonials-primary", "primary-title", "Heading", "What members value about a clearer process.", "textarea"),
  ...["one", "two", "three"].flatMap((key, index) => [
    field("testimonials-primary", `primary-${key}-placeholder`, `Member ${index + 1} placeholder`, "Member portrait"),
    field("testimonials-primary", `primary-${key}-name`, `Member ${index + 1} name`, ["Sam R.", "Taylor K.", "Casey M."][index]),
    field("testimonials-primary", `primary-${key}-location`, `Member ${index + 1} location`, ["Sydney, NSW", "Melbourne, VIC", "Brisbane, QLD"][index]),
    field("testimonials-primary", `primary-${key}-quote`, `Member ${index + 1} quote`, ["“I appreciated having time to understand the options before deciding what suited me.”", "“The reporting was straightforward and the educational material was easy to follow.”", "“A calmer process made it much easier to ask the right questions.”"][index], "textarea"),
    field("testimonials-primary", `primary-${key}-metric-label`, `Member ${index + 1} metric label`, "Member priority"),
    field("testimonials-primary", `primary-${key}-metric-value`, `Member ${index + 1} metric value`, ["Clarity", "Transparency", "Flexibility"][index]),
  ]),
  field("calculator", "calculator-eyebrow", "Eyebrow", "Illustrative calculator"), field("calculator", "calculator-title", "Heading", "See a simple portfolio illustration.", "textarea"),
  field("calculator", "calculator-lead", "Description", "The figures below are illustrative only. They are not a forecast, promise, or personal recommendation.", "textarea"),
  field("calculator", "calculator-inputs-title", "Inputs heading", "Illustrative inputs"), field("calculator", "calculator-inputs-copy", "Inputs description", "Example values for discussion."),
  field("calculator", "calculator-amount-label", "Amount label", "Starting amount"), field("calculator", "calculator-amount-value", "Amount value", "$5,000"),
  field("calculator", "calculator-horizon-label", "Horizon label", "Time horizon"), field("calculator", "calculator-horizon-value", "Horizon value", "12 months"),
  field("calculator", "calculator-result-label", "Result label", "Illustrative range"), field("calculator", "calculator-result-value", "Result value", "Review with an adviser"),
  field("calculator", "calculator-note", "Disclaimer", "This static example is for design preview only and does not calculate a result.", "textarea"),
  field("how-it-works", "steps-eyebrow", "Eyebrow", "How it works"), field("how-it-works", "steps-title", "Heading", "Three steps. No guesswork.", "textarea"),
  ...["one", "two", "three"].flatMap((key, index) => [field("how-it-works", `step-${key}-title`, `Step ${index + 1} title`, ["Open your account", "Choose your approach", "Track with context"][index]), field("how-it-works", `step-${key}-copy`, `Step ${index + 1} description`, ["Review the information and decide if the service is right for you.", "Consider the strategy and risk information at your own pace.", "Use clear reporting to keep informed about your choices."][index], "textarea")]),
  field("testimonials-secondary", "secondary-eyebrow", "Eyebrow", "A member perspective"), field("testimonials-secondary", "secondary-title", "Heading", "From first questions to greater confidence.", "textarea"),
  field("testimonials-secondary", "secondary-placeholder", "Member placeholder", "Member portrait"), field("testimonials-secondary", "secondary-name", "Member name", "Morgan P."), field("testimonials-secondary", "secondary-location", "Member location", "Perth, WA"), field("testimonials-secondary", "secondary-quote", "Member quote", "“I valued the chance to learn, compare the information, and make a decision on my own terms.”", "textarea"),
  field("statistics", "statistics-eyebrow", "Eyebrow", "The numbers"), field("statistics", "statistics-title", "Heading", "Information presented plainly.", "textarea"), field("statistics", "statistics-lead", "Description", "Charts are static visual illustrations, not performance information.", "textarea"),
  field("statistics", "statistics-chart-title", "Chart title", "Illustrative portfolio view"), field("statistics", "statistics-chart-label", "Chart label", "Example allocation"), field("statistics", "statistics-comparison-title", "Comparison title", "For comparison"), field("statistics", "statistics-comparison-copy", "Comparison description", "Consider your personal goals, timing, and risk tolerance.", "textarea"),
  field("testimonials-community", "community-eyebrow", "Eyebrow", "Community voices"), field("testimonials-community", "community-title", "Heading", "A few more reflections from the community.", "textarea"),
  ...Array.from({ length: 6 }, (_, index) => [
    field("testimonials-community", `community-${index + 1}-placeholder`, `Community member ${index + 1} placeholder`, "Community portrait"),
    field("testimonials-community", `community-${index + 1}-name`, `Community member ${index + 1} name`, ["Avery T.", "Riley G.", "Jamie L.", "Quinn S.", "Drew H.", "Parker N."][index]),
    field("testimonials-community", `community-${index + 1}-location`, `Community member ${index + 1} location`, "Australia"),
    field("testimonials-community", `community-${index + 1}-quote`, `Community member ${index + 1} quote`, ["“Clear language made it easier to follow.”", "“I had room to make my own decision.”", "“The overview gave me a useful starting point.”", "“The process felt considered and calm.”", "“I could revisit the information when I needed.”", "“It was helpful to see risks explained plainly.”"][index], "textarea"),
  ]).flat(),
  field("final-cta", "final-eyebrow", "Eyebrow", "Get started"), field("final-cta", "final-title", "Heading", "Take a considered first step today.", "textarea"), field("final-cta", "final-copy", "Description", "Open a Trader account in minutes, review the information, and decide on your own terms.", "textarea"), field("final-cta", "final-button", "Button label", "Open my account"),
];

const c = (value: string, className?: string) => h("div", className ? { class: className } : {}, [text(value)]);
const placeholder = (value: string, className = "") => h("div", { class: `placeholder ${className}`, role: "img", "aria-label": value }, [text(value)]);
const section = (id: BlockId, children: HtmlNode[], context: TemplateRenderContext, className = "section") => h("section", {
  id,
  class: `${className}${context.documentMode === "preview" && context.previewFocusedBlockId === id ? " preview-focused" : ""}`,
  ...(context.documentMode === "preview" ? { "data-block-id": id } : {}),
}, children);
const heading = (eyebrow: string, title: string) => h("div", { class: "section-head" }, [h("span", { class: "eyebrow" }, [text(eyebrow)]), h("h2", {}, [text(title)])]);
const v = (context: TemplateRenderContext, id: string) => context.value(id);

function memberCard(prefix: string, context: TemplateRenderContext, metric = false): HtmlNode {
  const children: HtmlNode[] = [h("div", { class: "person" }, [placeholder(v(context, `${prefix}-placeholder`), "avatar"), h("div", {}, [c(v(context, `${prefix}-name`), "person-name"), c(v(context, `${prefix}-location`), "person-meta")])]), h("p", { class: "quote" }, [text(v(context, `${prefix}-quote`))])];
  if (metric) children.push(h("div", { class: "metric" }, [text(v(context, `${prefix}-metric-label`)), h("strong", {}, [text(v(context, `${prefix}-metric-value`))]) ]));
  return h("article", { class: "card" }, children);
}

function renderBlock(blockId: BlockId, context: TemplateRenderContext): HtmlNode {
  switch (blockId) {
    case "hero": {
      const trusts = [1, 2, 3].map((index) => h("div", { class: "trust" }, [h("strong", {}, [text(v(context, `hero-trust-${index}-value`))]), h("span", {}, [text(v(context, `hero-trust-${index}-label`))])]));
      return section(blockId, [h("div", { class: "container hero-grid" }, [h("div", {}, [h("span", { class: "eyebrow" }, [text(v(context, "hero-eyebrow"))]), h("h1", {}, [text(v(context, "hero-title"))]), h("p", { class: "lead" }, [text(v(context, "hero-copy"))]), h("a", { class: "btn", href: "#registration-form" }, [text(v(context, "hero-cta"))]), h("div", { class: "trust-row" }, trusts)]), placeholder("Illustrative market graphic")])], context, "hero");
    }
    case "registration-form": {
      const inputs = (["name", "surname", "email", "phone"] as const).map((name) => h("label", { class: "field" }, [text(v(context, `form-${name}-label`)), h("input", { type: name === "email" ? "email" : name === "phone" ? "tel" : "text", placeholder: v(context, `form-${name}-label`), disabled: true })]));
      return section(blockId, [h("div", { class: "container" }, [h("div", { class: "form-card" }, [h("h2", {}, [text(v(context, "form-title"))]), h("p", { class: "lead" }, [text(v(context, "form-lead"))]), h("form", { "aria-label": "Visual-only registration form" }, [h("div", { class: "form-grid" }, inputs), h("button", { class: "btn", type: "button", disabled: true }, [text(v(context, "form-submit"))])]), h("p", { class: "note" }, [text(v(context, "form-note"))])])])], context);
    }
    case "press": return section(blockId, [h("div", { class: "container" }, [heading(v(context, "press-eyebrow"), v(context, "press-title")), h("div", { class: "press-grid" }, [1, 2, 3, 4, 5, 6].map((index) => placeholder(v(context, `press-logo-${index}`), "logo")))])], context);
    case "experts": {
      const cards = ["one", "two"].map((key) => h("article", { class: "card" }, [h("div", { class: "person" }, [placeholder(v(context, `expert-${key}-placeholder`), "avatar"), h("div", {}, [c(v(context, `expert-${key}-name`), "person-name"), c(v(context, `expert-${key}-role`), "person-meta")])]), h("p", { class: "quote" }, [text(v(context, `expert-${key}-quote`))]) ]));
      return section(blockId, [h("div", { class: "container" }, [heading(v(context, "experts-eyebrow"), v(context, "experts-title")), h("div", { class: "card-grid" }, cards)])], context);
    }
    case "testimonials-primary": return section(blockId, [h("div", { class: "container" }, [heading(v(context, "primary-eyebrow"), v(context, "primary-title")), h("div", { class: "card-grid" }, ["one", "two", "three"].map((key) => memberCard(`primary-${key}`, context, true)))])], context);
    case "calculator": {
      const controls = h("div", {}, [h("h3", {}, [text(v(context, "calculator-inputs-title"))]), h("p", {}, [text(v(context, "calculator-inputs-copy"))]), h("div", { class: "static-control" }, [text(v(context, "calculator-amount-label")), h("strong", {}, [text(v(context, "calculator-amount-value"))])]), h("div", { class: "static-control" }, [text(v(context, "calculator-horizon-label")), h("strong", {}, [text(v(context, "calculator-horizon-value"))])])]);
      const result = h("div", {}, [h("h3", {}, [text(v(context, "calculator-result-label"))]), h("p", { class: "lead" }, [text(v(context, "calculator-result-value"))]), h("p", { class: "note" }, [text(v(context, "calculator-note"))])]);
      return section(blockId, [h("div", { class: "container" }, [heading(v(context, "calculator-eyebrow"), v(context, "calculator-title")), h("p", { class: "lead" }, [text(v(context, "calculator-lead"))]), h("div", { class: "calc-card split" }, [controls, result])])], context);
    }
    case "how-it-works": return section(blockId, [h("div", { class: "container" }, [heading(v(context, "steps-eyebrow"), v(context, "steps-title")), h("div", { class: "step-grid" }, ["one", "two", "three"].map((key, index) => h("article", { class: "step" }, [h("span", { class: "eyebrow" }, [text(`0${index + 1}`)]), h("h3", {}, [text(v(context, `step-${key}-title`))]), h("p", {}, [text(v(context, `step-${key}-copy`))])])))])], context, "section dark");
    case "testimonials-secondary": return section(blockId, [h("div", { class: "container" }, [heading(v(context, "secondary-eyebrow"), v(context, "secondary-title")), memberCard("secondary", context)])], context);
    case "statistics": {
      const chart = h("article", { class: "card" }, [h("h3", {}, [text(v(context, "statistics-chart-title"))]), c(v(context, "statistics-chart-label"), "person-meta"), h("div", { class: "chart", role: "img", "aria-label": "Illustrative static bar chart" }, [35, 52, 68, 82, 95].map((height) => h("span", { class: "bar", style: `height:${height}%` }))) ]);
      const comparison = h("article", { class: "card" }, [h("h3", {}, [text(v(context, "statistics-comparison-title"))]), h("p", { class: "lead" }, [text(v(context, "statistics-comparison-copy"))])]);
      return section(blockId, [h("div", { class: "container" }, [heading(v(context, "statistics-eyebrow"), v(context, "statistics-title")), h("p", { class: "lead" }, [text(v(context, "statistics-lead"))]), h("div", { class: "split" }, [chart, comparison])])], context);
    }
    case "testimonials-community": return section(blockId, [h("div", { class: "container" }, [heading(v(context, "community-eyebrow"), v(context, "community-title")), h("div", { class: "community-track" }, Array.from({ length: 12 }, (_, index) => memberCard(`community-${(index % 6) + 1}`, context)))])], context);
    case "final-cta": return section(blockId, [h("div", { class: "wrap" }, [h("span", { class: "eyebrow" }, [text(v(context, "final-eyebrow"))]), h("h2", {}, [text(v(context, "final-title"))]), h("p", { class: "lead" }, [text(v(context, "final-copy"))]), h("a", { class: "btn", href: "#registration-form" }, [text(v(context, "final-button"))])])], context, "section final");
  }
}

export const trader3716Template: TemplateDefinition = {
  id: PROJECT_TEMPLATE_ID,
  name: "Trader 3716",
  description: "A long-form digital wealth landing page.",
  blocks,
  defaultBlockOrder: ["hero", "registration-form", "press", "experts", "testimonials-primary", "calculator", "how-it-works", "testimonials-secondary", "statistics", "testimonials-community", "final-cta"],
  fields,
  stylesheet: trader3716Styles,
  previewStylesheet: trader3716PreviewStyles,
  renderHeader: () => h("header", { class: "nav" }, [h("div", { class: "container nav-inner" }, [h("a", { class: "brand", href: "#hero" }, [text("TRADER")]), h("nav", { class: "nav-links", "aria-label": "Template navigation" }, [h("a", { href: "#how-it-works" }, [text("How it works")]), h("a", { href: "#calculator" }, [text("Calculator")]), h("a", { href: "#statistics" }, [text("Information")])]), h("a", { class: "nav-action", href: "#registration-form" }, [text("Open account")])])]),
  renderBlock,
  renderFooter: () => h("footer", {}, [h("div", { class: "container" }, [h("div", { class: "footer-top" }, [h("div", {}, [h("div", { class: "brand" }, [text("TRADER")]), h("p", {}, [text("Clear information for considered decisions.")])]), h("div", {}, [h("strong", {}, [text("Platform")]), h("p", {}, [text("How it works · Information · Contact")])])]), h("p", { class: "disclaimer" }, [text("Important: This static template is for demonstration only. It does not provide financial advice, make performance claims, or accept account applications. Consider independent professional advice before making financial decisions.")]), h("p", { class: "person-meta" }, [text("© 2026 Trader. All rights reserved.")])])]),
};
