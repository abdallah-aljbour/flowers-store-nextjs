// Browser-side access to the products service. The service (and the Firebase SDK behind it,
// ~85 KB compressed) is loaded on the first call instead of with the page, so it is not part of
// the first page load: Home and /shop already get their products with the HTML, and the
// product page with its server data. Same functions, same arguments, same results.
let service = null;

const load = () => {
  service ??= import("services/productsService").then((module) => module.productsService);
  return service;
};

export const productsService = {
  getAll: (...args) => load().then((s) => s.getAll(...args)),
  getById: (...args) => load().then((s) => s.getById(...args)),
  getTotalCount: (...args) => load().then((s) => s.getTotalCount(...args)),
};
