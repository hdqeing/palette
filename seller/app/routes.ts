import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("./layout.tsx", [
        index("./home.tsx"),
        route("query", "./query.tsx"),
        route("product", "./product.tsx"),
        route("order", "./order.tsx"),
        route("analysis", "./analysis.tsx"),
        route("notification", "./notification.tsx"),
        route("profile", "./profile.tsx"),
        route("setting", "./settings.tsx"),
        route("query/:queryId", "./query-detail.tsx")
    ])
] satisfies RouteConfig;
