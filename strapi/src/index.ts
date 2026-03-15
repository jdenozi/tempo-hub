// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   *
   * Roles are configured via admin panel after first deploy:
   * - Super Admin: Full access to all content types and settings
   * - Editor: Content management only (Pages, Blog Articles, Projects,
   *   Testimonials, Site Settings) + Media Library uploads
   *   Permissions: find, findOne, create, update, delete on all content types
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
