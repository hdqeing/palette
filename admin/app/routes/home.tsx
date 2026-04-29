import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Homepage" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home(
  
) {
  return (
    <p>main page</p>
  );
}
