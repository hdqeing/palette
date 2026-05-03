import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("./layouts/layout.tsx", [
        index("./routes/home.tsx"),
        route("query", "./routes/query.tsx"),
        route("product", "./routes/product.tsx"),
        route("order", "./routes/order.tsx"),
        route("analysis", "./routes/analysis.tsx"),
        route("notification", "./routes/notification.tsx"),
        route("profile", "./routes/profile.tsx"),
        route("setting", "./routes/settings.tsx"),
    ])
] satisfies RouteConfig;
