import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("./layouts/layout.tsx", [
        index("./routes/home.tsx"),
        route("queries", "./routes/queries.tsx"),
        route("queries/:queryId", "./routes/query-detail.tsx"),
        route("product", "./routes/product.tsx"),
        route("orders", "./routes/orders.tsx"),
        route("orders/:orderId", "./routes/order-detail.tsx"),
        route("analysis", "./routes/analysis.tsx"),
        route("notification", "./routes/notification.tsx"),
        route("profile", "./routes/profile.tsx"),
        route("setting", "./routes/settings.tsx"),
    ])
] satisfies RouteConfig;