import { createTRPCRouter } from "../../trpc";
import { create } from "./create";
import { deleteCustomer } from "./delete";
import { getAllCustomers } from "./get-all";
import { getCustomerById } from "./get-by-id";
import { updateCustomer } from "./update";

export const customersRouter = createTRPCRouter({
  create,
  delete: deleteCustomer,
  getAll: getAllCustomers,
  getById: getCustomerById,
  update: updateCustomer,
});
