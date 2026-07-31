import type { SceneId } from "@/types";
import FinishLineScene from "./FinishLineScene";
import ServerConnectScene from "./ServerConnectScene";

interface ScenePanelProps {
  sceneId: SceneId;
  progress: number;
  done?: boolean;
  correct?: boolean;
  className?: string;
}

export default function ScenePanel({
  sceneId,
  progress,
  done,
  correct,
  className,
}: ScenePanelProps) {
  return sceneId === "server-connect" ? (
    <ServerConnectScene
      progress={progress}
      done={done}
      correct={correct}
      className={className}
    />
  ) : (
    <FinishLineScene progress={progress} className={className} />
  );
}
