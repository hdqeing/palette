import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("layouts/layout.tsx", [
        index("routes/home.tsx"),
        route("seller", "routes/seller.tsx"),
        route("seller/:sellerId", "routes/seller-detail.tsx"),
        route("query", "routes/query-overview.tsx"),
        route("query/:queryId", "routes/query-detail.tsx"),
        route("profile", "routes/profile.tsx"),
        route("pallet/:palletId/stock", "routes/pallet-stock.tsx")
    ])
] satisfies RouteConfig;
