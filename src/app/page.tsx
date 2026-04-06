import { cities } from "@/lib/cities";
import { HomeClient } from "./HomeClient";

export default function HomePage() {
  return <HomeClient cities={cities} />;
}
