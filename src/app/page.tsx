import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { Button } from "~/components/ui/button";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <h1>Hello and welcome</h1>
      <Button>Click me</Button>
    </HydrateClient>
  );
}
