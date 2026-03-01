---
title: "WordPress vs custom sites: we compared performance, and it's brutal"
description: "Core Web Vitals, load times, security, HTML markup... We put WordPress head to head with a custom-coded site. Spoiler: one of them gets destroyed."
date: 2026-02-15
---

Let's not beat around the bush: WordPress powers 43% of the web. It's a powerful tool, and there's a good reason it's so popular.

But when we're talking SEO and raw performance, the architecture of a custom-coded site has structural advantages that no WordPress plugin can make up for. And we're going to prove it with hard numbers.

At Tempo Hub, we build static sites with Nuxt.js. Yes, we're biased. But the data we're about to show you is objective. See for yourself.

## 1. Performance: Google's #1 ranking factor

### What Google actually measures

Since 2021, Google uses **Core Web Vitals** as a direct ranking factor. Three metrics matter:

- **LCP (Largest Contentful Paint)**: how long it takes to display the largest visible element on the page. Threshold: 2.5 seconds max.
- **INP (Interaction to Next Paint)**: how fast the page responds to clicks and interactions. Threshold: 200ms max.
- **CLS (Cumulative Layout Shift)**: visual stability during page load. Threshold: 0.1 max.

Bottom line: slow site = Google penalizes you. Period.

### Why WordPress struggles

WordPress runs on **PHP + MySQL**. On every visit, the server executes PHP, queries the database, assembles the page, then sends it to the browser. Even with caching, this chain creates unavoidable latency.

Add a page builder like Elementor or Divi, and it's game over:

- **Elementor** injects 300 to 500 KB of CSS and JavaScript, even on a page with just text
- **Divi** generates dozens of nested `<div>` elements that bloat the DOM beyond recognition
- Every active plugin (forms, analytics, sliders, popups) adds its own CSS/JS files on **every single page**, whether they're used or not

Result: an average WordPress page weighs between **2 and 5 MB** and loads in **3 to 6 seconds** on mobile. Yikes.

![When you realize your WordPress page weighs 4 MB on mobile](/images/blog/wordpress-vs-custom/page-weight-meme.webp)

### A static site is a different planet

With Nuxt.js in SSG mode (Static Site Generation), every page is pre-rendered as pure HTML at build time. When a visitor arrives, the server sends back the HTML file directly. No PHP execution. No database query. Nothing.

### The performance numbers (brace yourself)

```
📊 Lighthouse Performance Score
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress + Elementor  ████████░░░░░░░░░░░░  40/100  😬
Custom site (Nuxt)     ████████████████████  98/100  🔥

📊 Mobile Load Time
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress + Elementor  █████████████████░░░  4.2s   🐌
Custom site (Nuxt)     ███░░░░░░░░░░░░░░░░░  0.8s   🚀

📊 Average Page Weight
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress + Elementor  ████████████████████  3.2 MB 💀
Custom site (Nuxt)     █░░░░░░░░░░░░░░░░░░░  80 KB  ✨

📊 TTFB (Time To First Byte)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress + Elementor  ████████████████░░░░  1.2s
Custom site (Nuxt)     █░░░░░░░░░░░░░░░░░░░  <50ms  ⚡

📊 HTTP Requests Per Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress + Elementor  ████████████████████  60+
Custom site (Nuxt)     ████░░░░░░░░░░░░░░░░  ~10
```

For Google, a site that loads in under one second with a near-perfect Lighthouse score is a massive signal of technical quality.

| Metric | WordPress + Elementor | Custom site (Nuxt) |
|---|---|---|
| Average page weight | 2 to 5 MB | 30 to 100 KB |
| Mobile load time | 3 to 6 seconds | < 1 second |
| Lighthouse Performance | 30 to 60 | 95 to 100 |
| TTFB (Time To First Byte) | 800 ms to 2 s | < 50 ms |
| HTTP requests per page | 40 to 80 | 5 to 15 |
| Core Web Vitals (pass rate) | ~33% | ~98% |

## 2. HTML markup: clean code vs div soup

### Why this matters

Search engines don't see your site the way you do. They read raw HTML and interpret its structure to understand your content. Clean, semantic markup is the foundation for Google to figure out what your page is about.

### The WordPress problem

On WordPress, the HTML depends entirely on your theme and plugins. And most popular themes generate code that looks like this:

```html
<div class="et_pb_module et_pb_text et_pb_text_0 et_pb_bg_layout_light et_pb_text_align_left">
  <div class="et_pb_text_inner">
    <div class="et_pb_module_inner">
      <h2 class="et_pb_module_header">My heading</h2>
    </div>
  </div>
</div>
```

Six levels of `<div>` to display a heading. **A single heading.** 🤡

![Expectation vs Reality of WordPress HTML output](/images/blog/wordpress-vs-custom/div-soup-meme.webp)

```
📊 DOM Nodes Per Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress (Elementor)  ████████████████████  ~2500 nodes
Custom site            ████░░░░░░░░░░░░░░░░  ~350 nodes

📊 Content-to-Markup Ratio
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress (Elementor)  ███░░░░░░░░░░░░░░░░░  ~15%
Custom site            ██████████████░░░░░░  ~70%

📊 Average DOM Depth
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress (Elementor)  ████████████████████  15 to 25 levels
Custom site            ██████░░░░░░░░░░░░░░  5 to 8 levels
```

### The same heading, custom-coded

```html
<article>
  <header>
    <h1>My heading</h1>
    <time datetime="2025-01-15">January 15, 2025</time>
  </header>
  <section>
    <h2>My subsection</h2>
    <p>My optimized content.</p>
  </section>
</article>
```

Clean. Semantic. Lightweight. Google immediately understands the structure. The signal-to-noise ratio is at its maximum.

## 3. Structured data: rich snippets without the headaches

### The opportunity

Structured data (Schema.org) lets you get rich results in Google: review stars, expandable FAQs, product prices, opening hours, breadcrumbs. These rich results can boost click-through rates by 20 to 30%.

### On WordPress

Structured data goes through plugins (Yoast SEO, Rank Math). They work fine for basic cases, but hit their limits fast:

- Custom schemas (LocalBusiness with specific attributes)
- Complex nested schemas (Product + AggregateRating + Offer + FAQ)
- Consistency between visible content and structured data
- Conflicts between plugins generating duplicate schemas

### On a custom site

Structured data is embedded directly in the source code as JSON-LD, with complete control:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Dupont Bakery",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "12 Peace Street",
    "addressLocality": "Lyon",
    "postalCode": "69001"
  },
  "openingHoursSpecification": [],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}
```

Every piece of data is accurate, validated, and aligned with the displayed content. No intermediary plugin, no conflicts, no guesswork.

## 4. Resource management: surgical loading vs global chaos

### The WordPress problem

One of the most costly WordPress performance flaws: **global resource loading**. Install a contact form plugin? Its CSS and JS load on **every single page**. Even the ones without any form.

A typical WordPress site with 10 plugins loads 15 to 30 separate CSS/JS files on every page. Each file = an HTTP request, parsing time, and extra weight.

![Me installing the 15th WordPress optimization plugin](/images/blog/wordpress-vs-custom/plugins-meme.webp)

Optimization plugins (WP Rocket, Autoptimize) only mitigate the damage: they concatenate and minify, but the unused code is still downloaded and executed by the browser.

### Modern frameworks are surgical

Nuxt.js includes natively:

- **Tree-shaking**: only the JavaScript actually used ends up in the final bundle. Import a single function from a library? Only that function gets shipped.
- **Code-splitting**: each page loads only its own JavaScript. The homepage doesn't download the contact page's code.
- **Intelligent lazy-loading**: images, heavy components, and non-critical resources only load when the user needs them.

Result: each page contains only the bare minimum. Not a byte more.

## 5. URLs and crawl budget

### What's crawl budget

Google allocates each site a limited number of pages that Googlebot will explore per visit. For a small site it's not super critical, but crawl efficiency remains a signal of technical quality.

### WordPress and its ghost pages

By default, WordPress generates a bunch of pages nobody asked for:

- **Author archives** (`/author/admin/`): usually duplicate content
- **Date archives** (`/2025/01/`): zero SEO value
- **Empty or near-empty tag and category pages**
- **Internal search pages** accidentally indexed
- **Attachment pages** (every uploaded image creates its own page 🤦)
- **Parameterized URLs** (`?replytocom=`, `?p=`) generating duplicate content
- **RSS feed pages** sometimes indexed

Each of these dilutes the crawl budget and creates duplicate content. Yoast tries to block these with `noindex`... but it's a band-aid on a broken leg.

### A custom site

Every URL exists because we decided it should. Zero parasitic pages, zero accidental duplicate content. The `sitemap.xml` is auto-generated and only contains relevant pages. The `robots.txt` is configured once, cleanly.

Googlebot explores 100% useful pages instead of wasting visits on empty archives.

## 6. Security: the SEO factor everyone forgets

### The concrete impact

A hacked or malware-infected site gets:

- **Demoted** by Google in search results
- **Flagged** with a "This site may harm your computer" warning (RIP your click-through rate)
- **Deindexed** in serious cases

Recovery can take weeks. Sometimes months in terms of rankings.

### WordPress: target number one

WordPress accounts for about 90% of hacked CMS sites. Here's why:

- **Vulnerable plugins**: every plugin is a potential entry point. In 2024, over 7,000 WordPress vulnerabilities were reported.
- **Outdated themes**: themes that aren't updated contain known, documented security flaws.
- **Brute force attacks**: `/wp-admin` is a universally known target.
- **SQL injections**: the PHP/MySQL architecture exposes a significant attack surface.

![This is fine - like your WordPress with 3 outdated plugins](/images/blog/wordpress-vs-custom/this-is-fine.webp)

Keeping a WordPress site secure demands constant vigilance: weekly updates, plugin monitoring, frequent backups, application firewalls.

### A static site? Nearly unattackable.

No database to hack. No exposed admin panel. No server-side code to exploit. It's HTML, CSS, and JavaScript. Inert files served as-is.

The attack surface is reduced to the bare minimum: the web server itself. The site stays online, available, and intact.

## 7. Mobile-first

### Why it's crucial

Since 2021, Google uses **exclusively** the mobile version of a site for indexing and ranking. Site not optimized for mobile = rankings penalized. End of story.

### WordPress and responsive design

WordPress themes are "responsive" on paper. In the real world:

- Page builders (Elementor, Divi, WPBakery) generate complex layouts that adapt poorly to small screens
- Elements hidden on mobile with `display: none` are still downloaded (the browser loads everything, then hides it... great logic 🙃)
- Images aren't always served at the right size (your phone downloads the 2000px desktop image)
- Custom web fonts multiplied by themes add hundreds of KB

### Native mobile-first approach

A custom-coded site is designed mobile-first from line one:

- Images served at the right size via `<picture>` and `srcset`, with modern formats (WebP, AVIF)
- CSS written mobile-first: the mobile version is the baseline, desktop adaptations come via `@media`
- No hidden elements downloaded unnecessarily
- Fonts loaded with `font-display: swap` and an optimized subset

## 8. Content updates and freshness

### Why freshness matters

Google values fresh, regularly updated content. A site whose content evolves is considered more relevant than one that stays frozen.

### The WordPress workflow

Updating a page on WordPress: log into the back-office, navigate the editor (often slow with page builders), edit the content, save, then clear the cache. It's tedious, and as a result, updates get postponed.

On top of that, every WordPress, theme, or plugin update can break the site. Site owners delay updates out of fear of regressions. Vicious cycle: outdated site, less secure, less performant.

### A headless CMS for simplicity

With a headless CMS like Nuxt Studio, content updates are decoupled from the code. The client edits text or images in a visual interface, and the site regenerates automatically. No risk of breaking anything, no technical updates to manage.

Fresh content, stable site.

## 9. Advanced optimizations impossible on WordPress

Some SEO techniques are native in a modern framework but impossible (or so complex nobody actually does it) on WordPress:

### Intelligent prefetching

Nuxt.js detects links visible on screen and pre-loads the corresponding pages in the background. When the user clicks, the page is already in memory: navigation feels instant. Try doing that natively on WordPress.

### Automatic optimized sitemap

The sitemap is generated at build time with the exact metadata of each page (last modified, priority, frequency). On WordPress, you depend on a plugin that has to query the database every time.

### HTTP header control

`Cache-Control`, `ETag`, `Content-Security-Policy`, `X-Content-Type-Options` headers are configured directly at the server level, without an abstraction layer. Every header is optimized for performance and security.

### Conditional rendering by device

Components can be rendered differently depending on the device at build time, avoiding unnecessary code downloads. WordPress loads everything and visually hides what's not relevant.

## The verdict

Let's be honest: you can absolutely rank a WordPress site well. Millions of WordPress sites sit on Google's first page. But they get there **despite** their architecture, not **because of** it.

### The final comparison

```
📊 Lighthouse Score
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress            ████████░░░░░░░░░░░░  30-60
Custom site          ████████████████████  95-100

📊 Vulnerabilities / Year
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress            ████████████████████  7,000+
Custom site          ░░░░░░░░░░░░░░░░░░░░  ~0

📊 Monthly Maintenance Cost
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WordPress            ████████████████░░░░  $55-220
Custom site          ███░░░░░░░░░░░░░░░░░  ~$16
```

| Criteria | WordPress | Custom site |
|---|---|---|
| Lighthouse Performance | 30-60 | 95-100 |
| Mobile load time | 3-6s | < 1s |
| Security (vulns/year) | 7,000+ | ~0 |
| Monthly maintenance | $55-220/mo | ~$16/mo |
| Generated duplicate content | Archive pages, tags, authors, attachments | None |
| Structured data | Via plugins (frequent conflicts) | Native, validated, conflict-free |
| Mobile-first | Adaptive (hides elements) | Native (only loads what's needed) |
| Content updates | Slow back-office, risk of breakage | Headless CMS, zero risk |

For a WordPress site to reach comparable SEO performance, you need:

- A lightweight, well-coded theme (not Elementor/Divi)
- 5 to 10 optimization plugins (cache, minification, lazy-load, WebP, CDN)
- Advanced technical configuration (htaccess, database, PHP)
- Constant maintenance (updates, monitoring, backups)
- A monthly budget for performant hosting and premium plugins

All of this is **native** on a custom-coded site. It's the difference between strapping wings onto a truck and designing a plane from scratch.

## Let's talk about it

At Tempo Hub, we build sites with all these SEO optimizations baked in from day one. Every site is statically generated, semantically marked up, mobile-optimized, and designed to deliver the best possible experience to visitors and search engines alike.

Are you a craftsperson, retailer, or small business owner? **Your online visibility deserves better than a WordPress theme weighed down by twenty plugins.** Get in touch to see what a custom site can do for your search rankings.
