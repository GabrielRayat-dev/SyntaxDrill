import type { SceneId } from "@/types";
import FinishLineScene from "./FinishLineScene";
import ServerConnectScene from "./ServerConnectScene";

interface ScenePanelProps {
  sceneId: SceneId;
  progress: number;
  className?: string;
}

export default function ScenePanel({ sceneId, progress, className }: ScenePanelProps) {
  return sceneId === "server-connect" ? (
    <ServerConnectScene progress={progress} className={className} />
  ) : (
    <FinishLineScene progress={progress} className={className} />
  );
}
