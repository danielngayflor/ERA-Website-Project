// ERA CMS Configuration — uses window.location.origin so it works on
// localhost, Vercel preview URLs, and the production domain without changes.
CMS.init({
  config: {
    backend: {
      name: 'github',
      repo: 'danielngayflor/ERA-Website-Project',
      branch: 'main',
      base_url: window.location.origin,
      auth_endpoint: '/api/auth',
    },
    media_folder: 'images',
    public_folder: 'images',
    collections: [
      // ────────────────────────────────────────────────────────────────
      // RESOURCES (News & Publications)
      // ────────────────────────────────────────────────────────────────
      {
        name: 'resources',
        label: 'Resources',
        label_singular: 'Resource',
        description: 'News articles, stories, ERA magazines, case studies, opinion pieces, and external links shown in the Resource Hub.',
        files: [
          {
            name: 'resources',
            label: 'All Resources',
            file: 'content/resources.json',
            fields: [
              {
                name: 'resources',
                label: 'Resources',
                widget: 'list',
                summary: '{{fields.title}} ({{fields.category}})',
                fields: [
                  { name: 'id', label: 'ID (slug)', widget: 'string', hint: 'Unique identifier, e.g. dakar-forum. No spaces.' },
                  {
                    name: 'category',
                    label: 'Category',
                    widget: 'select',
                    options: [
                      { label: 'Story', value: 'story' },
                      { label: 'Case Study', value: 'casestudy' },
                      { label: 'ERA Magazine / Newsletter', value: 'newsletter' },
                      { label: 'Opinion Piece', value: 'opinion' },
                      { label: 'External Resource', value: 'external' },
                    ],
                  },
                  { name: 'tag', label: 'Tag label (shown on card)', widget: 'string' },
                  { name: 'title', label: 'Title', widget: 'string' },
                  { name: 'meta', label: 'Meta line (author / date)', widget: 'string', required: false },
                  { name: 'excerpt', label: 'Excerpt', widget: 'text' },
                  { name: 'image', label: 'Card image path', widget: 'image', required: false, hint: 'Optional. Use images/ folder.' },
                  { name: 'imageAlt', label: 'Image alt text', widget: 'string', required: false },
                  { name: 'linkUrl', label: 'Link URL', widget: 'string', required: false, hint: 'Internal page (e.g. story-dakar.html) or external URL.' },
                  { name: 'linkLabel', label: 'Link label', widget: 'string', required: false, default: 'Read More →' },
                  { name: 'downloadUrl', label: 'Download URL (PDF)', widget: 'string', required: false },
                  { name: 'externalBadge', label: 'Show "External ↗" badge?', widget: 'boolean', default: false },
                  {
                    name: 'status',
                    label: 'Status',
                    widget: 'select',
                    options: [
                      { label: 'Published', value: 'published' },
                      { label: 'Draft (hidden from public)', value: 'draft' },
                    ],
                    default: 'published',
                  },
                ],
              },
            ],
          },
        ],
      },

      // ────────────────────────────────────────────────────────────────
      // TEAM
      // ────────────────────────────────────────────────────────────────
      {
        name: 'team',
        label: 'Team Members',
        label_singular: 'Team Member',
        description: 'Secretariat staff and Steering Committee members shown on the About page.',
        files: [
          {
            name: 'team',
            label: 'All Team Members',
            file: 'content/team.json',
            fields: [
              {
                name: 'secretariat',
                label: 'Secretariat Staff',
                widget: 'list',
                summary: '{{fields.name}} — {{fields.role}}',
                fields: [
                  { name: 'id', label: 'ID (slug)', widget: 'string' },
                  { name: 'name', label: 'Full Name', widget: 'string' },
                  { name: 'role', label: 'Role / Title', widget: 'string' },
                ],
              },
              {
                name: 'steering',
                label: 'Steering Committee',
                widget: 'list',
                summary: '{{fields.name}} — {{fields.role}}',
                fields: [
                  { name: 'id', label: 'ID (slug)', widget: 'string' },
                  { name: 'name', label: 'Full Name', widget: 'string' },
                  { name: 'role', label: 'Role / Organisation / Region', widget: 'string' },
                  {
                    name: 'highlight',
                    label: 'Highlight colour',
                    widget: 'select',
                    required: false,
                    options: [
                      { label: 'None (default)', value: '' },
                      { label: 'Terracotta (Chairman)', value: 'chairman' },
                      { label: 'Terracotta (Co-Chair)', value: 'chair' },
                      { label: 'Grey (Observer)', value: 'observer' },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // ────────────────────────────────────────────────────────────────
      // PARTNERS / DONORS
      // ────────────────────────────────────────────────────────────────
      {
        name: 'partners',
        label: 'Partners & Donors',
        label_singular: 'Partner',
        description: 'Donor logos shown at the bottom of the homepage.',
        files: [
          {
            name: 'partners',
            label: 'All Partners',
            file: 'content/partners.json',
            fields: [
              {
                name: 'partners',
                label: 'Partners',
                widget: 'list',
                summary: '{{fields.name}}',
                fields: [
                  { name: 'id', label: 'ID (slug)', widget: 'string' },
                  { name: 'name', label: 'Organisation Name', widget: 'string' },
                  { name: 'logo', label: 'Logo image', widget: 'image' },
                  { name: 'url', label: 'Website URL', widget: 'string', required: false },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
