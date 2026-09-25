import { GuideMap } from "./guide-map";
import { spotsOnFloor } from "../domain/spots";

export default function GuidePage() {
  return (
    <main className="guide-page">
      <h1>館内案内</h1>
      <GuideMap floor1={spotsOnFloor(1)} floor2={spotsOnFloor(2)} />
    </main>
  );
}
