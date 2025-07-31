const ROOTS = {
  DASHBOARD: "/",
  LOGIN: "/login",
};

export const paths = {
  login: {
    root: ROOTS.LOGIN,
  },
  error: "/error",

  dashboard: {
    root: ROOTS.DASHBOARD,
  },
  brands: {
    root: "/brands",
    add: "/brands/add",
  },
  categories: {
    root: "/categories",
    new: "/categories/new",
    tree: "/categories/tree",
    edit: (id: string) => `/categories/edit/${id}`,
  },
};
