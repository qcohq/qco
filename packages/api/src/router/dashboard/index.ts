import { createTRPCRouter } from "../../trpc"

import { getRecentOrders } from "./recent-orders"
import { getTopProducts } from "./top-products"
import { revenueChart } from "./revenue-chart"
import { stats } from "./stats"

export const dashboardRouter = createTRPCRouter({
  getRecentOrders,
  getTopProducts,
  revenueChart,
  stats
})
