// Blog preview template
const BlogPreview = createClass({
  render: function () {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']) || '';
    const description = entry.getIn(['data', 'description']) || '';
    const date = entry.getIn(['data', 'date']);
    const image = entry.getIn(['data', 'image']);

    return h('div', { className: 'preview-blog' },
      image && h('img', { className: 'cover', src: this.props.getAsset(image).toString(), alt: title }),
      h('h1', {}, title),
      h('div', { className: 'meta' },
        date ? new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : ''
      ),
      description && h('p', { className: 'description' }, description),
      h('div', {}, this.props.widgetFor('body'))
    );
  }
});

// Testimonial preview template
const TestimonialPreview = createClass({
  render: function () {
    const entry = this.props.entry;
    const name = entry.getIn(['data', 'name']) || '';
    const role = entry.getIn(['data', 'role']) || '';
    const photo = entry.getIn(['data', 'photo']);
    const quote = entry.getIn(['data', 'quote']) || '';
    const rating = entry.getIn(['data', 'rating']) || 5;

    return h('div', { className: 'preview-testimonial' },
      h('div', { className: 'stars' }, '★'.repeat(rating) + '☆'.repeat(5 - rating)),
      h('div', { className: 'quote' }, '« ', this.props.widgetFor('quote'), ' »'),
      h('div', { className: 'author' },
        photo && h('img', { src: this.props.getAsset(photo).toString(), alt: name }),
        h('div', {},
          h('div', { className: 'author-name' }, name),
          h('div', { className: 'author-role' }, role)
        )
      )
    );
  }
});

// FAQ preview template
const FaqPreview = createClass({
  render: function () {
    const entry = this.props.entry;
    const question = entry.getIn(['data', 'question']) || '';
    const category = entry.getIn(['data', 'category']) || '';

    return h('div', { className: 'preview-faq' },
      h('div', { className: 'question' },
        question,
        category && h('span', { className: 'category' }, category)
      ),
      h('div', { className: 'answer' }, this.props.widgetFor('answer'))
    );
  }
});

// Project preview template
const ProjectPreview = createClass({
  render: function () {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']) || '';
    const image = entry.getIn(['data', 'image']);
    const url = entry.getIn(['data', 'url']) || '';
    const date = entry.getIn(['data', 'date']);
    const tags = entry.getIn(['data', 'tags']);
    const featured = entry.getIn(['data', 'featured']);

    const tagList = tags ? tags.toJS() : [];

    return h('div', { className: 'preview-project' },
      image && h('img', { className: 'cover', src: this.props.getAsset(image).toString(), alt: title }),
      h('div', { className: 'tags' },
        featured && h('span', { className: 'tag tag-featured' }, '★ Featured'),
        tagList.map(function (tag) {
          return h('span', { className: 'tag', key: tag }, tag);
        })
      ),
      h('h1', {}, title),
      h('div', { className: 'meta' },
        date ? new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : ''
      ),
      h('div', { className: 'description' }, this.props.widgetFor('description')),
      url && h('a', { className: 'url', href: url, target: '_blank' }, '🔗 ', url),
      h('div', {}, this.props.widgetFor('body'))
    );
  }
});

// Register all preview templates
CMS.registerPreviewTemplate('blog', BlogPreview);
CMS.registerPreviewTemplate('testimonials', TestimonialPreview);
CMS.registerPreviewTemplate('faq', FaqPreview);
CMS.registerPreviewTemplate('projects', ProjectPreview);

// Register preview CSS for all collections
CMS.registerPreviewStyle('/admin/preview.css');

// Inject analytics link into the CMS sidebar (collection list)
document.addEventListener('DOMContentLoaded', function () {
  var injected = false;

  var observer = new MutationObserver(function () {
    if (injected) return;

    // Find the sidebar collection list (nav with links to collections)
    var sidebar = document.querySelector('[class*="Sidebar"] nav ul')
      || document.querySelector('nav[class*="Collection"] ul')
      || document.querySelector('aside ul');

    // Fallback: find any <ul> inside the sidebar area that contains collection links
    if (!sidebar) {
      var allLists = document.querySelectorAll('ul');
      for (var i = 0; i < allLists.length; i++) {
        var links = allLists[i].querySelectorAll('a[href*="/collections/"]');
        if (links.length >= 2) {
          sidebar = allLists[i];
          break;
        }
      }
    }

    if (!sidebar) return;

    injected = true;

    // Create a separator
    var separator = document.createElement('li');
    separator.style.cssText = 'border-top:1px solid #e8d4c0;margin:12px 0;padding:0;list-style:none;';
    sidebar.appendChild(separator);

    // Create analytics link styled like other sidebar items
    var li = document.createElement('li');
    li.style.cssText = 'list-style:none;';

    var link = document.createElement('a');
    link.href = '/admin/stats/';
    link.innerHTML = '📊&nbsp;&nbsp;Analytics';
    // Copy styling from existing sidebar links
    var existingLink = sidebar.querySelector('a');
    if (existingLink) {
      link.className = existingLink.className;
    }
    link.style.cssText += 'display:flex;align-items:center;padding:8px 16px;text-decoration:none;color:#d96a4a;font-weight:600;font-size:14px;border-radius:4px;transition:background 0.2s;';
    link.onmouseenter = function () { link.style.background = 'rgba(217,106,74,0.08)'; };
    link.onmouseleave = function () { link.style.background = 'transparent'; };

    li.appendChild(link);
    sidebar.appendChild(li);

    // Also add a "View Site" link
    var li2 = document.createElement('li');
    li2.style.cssText = 'list-style:none;';

    var siteLink = document.createElement('a');
    siteLink.href = '/';
    siteLink.target = '_blank';
    siteLink.innerHTML = '🌐&nbsp;&nbsp;View Site';
    if (existingLink) {
      siteLink.className = existingLink.className;
    }
    siteLink.style.cssText += 'display:flex;align-items:center;padding:8px 16px;text-decoration:none;color:#9a7a54;font-weight:500;font-size:14px;border-radius:4px;transition:background 0.2s;';
    siteLink.onmouseenter = function () { siteLink.style.background = 'rgba(154,122,84,0.08)'; };
    siteLink.onmouseleave = function () { siteLink.style.background = 'transparent'; };

    li2.appendChild(siteLink);
    sidebar.appendChild(li2);
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
