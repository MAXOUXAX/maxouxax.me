import { Button } from "~/components/ui/button";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <>
      <h1>Hello and welcome</h1>
      <Button>Click me</Button>
    </>
  );
}
