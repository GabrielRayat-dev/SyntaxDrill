import { parsePracticeParams, practiceSeed } from "@/lib/config";
import { buildSession, mulberry32 } from "@/lib/session";
import PracticeScreen from "./PracticeScreen";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PracticePage({ searchParams }: Props) {
  const params = await searchParams;
  const initialConfig = parsePracticeParams(params);
  const initialSession = initialConfig
    ? buildSession(initialConfig, mulberry32(practiceSeed(initialConfig)))
    : [];

  return (
    <PracticeScreen
      initialConfig={initialConfig}
      initialSession={initialSession}
    />
  );
}
