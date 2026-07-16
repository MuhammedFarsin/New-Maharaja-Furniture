import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/scenes/Home";

export const Route = createFileRoute("/")({
  component: HomePage,
});