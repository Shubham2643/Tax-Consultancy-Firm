export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const getServicePath = (service) =>
  `/services/${service.slug || slugify(service.title) || service._id}`;
