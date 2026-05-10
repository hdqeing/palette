import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("layouts/dashboard.tsx", [
        index("routes/home.tsx"),
        route("user", "routes/user.tsx"),
        route("company", "routes/company.tsx"),
        route("pallet", "routes/pallet.tsx"),
        route("inventory", "routes/inventory.tsx"),
        route("request", "routes/request.tsx")
    ])
] satisfies RouteConfig;
