import { parseSpeedParams, speedSeed } from "@/lib/config";
import { pickWords } from "@/lib/words";
import { mulberry32 } from "@/lib/session";
import { TIME_BUFFER } from "./SpeedScreen";
import SpeedScreen from "./SpeedScreen";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SpeedPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialConfig = parseSpeedParams(params);
  const initialWords = initialConfig
    ? pickWords(
        initialConfig.mode === "time" ? TIME_BUFFER : initialConfig.target,
        mulberry32(speedSeed(initialConfig)),
      )
    : [];

  return (
    <SpeedScreen initialConfig={initialConfig} initialWords={initialWords} />
  );
}
