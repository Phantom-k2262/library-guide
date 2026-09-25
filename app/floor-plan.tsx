import { FLOOR_X_MAX, FLOOR_Y_MAX } from "../domain/layout";

type Props = {
  floor: 1 | 2;
};

export function FloorPlan({ floor }: Props) {
  return (
    <svg
      className="floor-plan"
      viewBox={`0 0 ${FLOOR_X_MAX} ${FLOOR_Y_MAX}`}
      aria-hidden="true"
    >
      <rect className="plan-floor" x="0" y="0" width={FLOOR_X_MAX} height={FLOOR_Y_MAX} />
      <g className="plan-grid">
        {Array.from({ length: 17 }, (_, i) => (
          <line key={`v${i}`} x1={i * 2} y1="0" x2={i * 2} y2={FLOOR_Y_MAX} />
        ))}
        {Array.from({ length: 14 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 2} x2={FLOOR_X_MAX} y2={i * 2} />
        ))}
      </g>
      <g transform={`translate(0 ${FLOOR_Y_MAX}) scale(1 -1)`}>
        <rect className="plan-wall" x="0.4" y="0.4" width="33.2" height="27.2" />
        {floor === 1 ? <FirstFloorMarks /> : <SecondFloorMarks />}
      </g>
      <text className="plan-label" x="3.2" y="26.6">
        入口
      </text>
      <text className="plan-label" x="28.2" y="3.4">
        {floor === 1 ? "2Fへ" : "1Fへ"}
      </text>
    </svg>
  );
}

function FirstFloorMarks() {
  return (
    <g className="plan-furniture">
      <rect x="2.2" y="1.2" width="4.2" height="2.2" rx="0.3" />
      <rect x="4.2" y="4" width="3.2" height="2.6" rx="0.3" />
      <rect x="13.2" y="6.6" width="5.2" height="2.8" rx="0.3" />
      <rect x="16.4" y="10.6" width="4.4" height="2.6" rx="0.3" />
      <rect x="6.4" y="18.4" width="4.6" height="4.2" rx="0.3" />
      <rect x="23.2" y="3.8" width="4.6" height="2.8" rx="0.3" />
      <rect x="26.4" y="8.6" width="4.2" height="2.6" rx="0.3" />
      <rect x="27.6" y="18.4" width="4.2" height="3.2" rx="0.3" />
      <rect x="20.2" y="16.4" width="4.2" height="2.8" rx="0.3" />
    </g>
  );
}

function SecondFloorMarks() {
  return (
    <g className="plan-furniture">
      <rect x="4.6" y="4.8" width="4.2" height="2.6" rx="0.3" />
      <rect x="10.6" y="6.6" width="4.2" height="2.6" rx="0.3" />
      <rect x="14.6" y="8.6" width="4.2" height="2.6" rx="0.3" />
      <rect x="22.2" y="4.6" width="5.2" height="3.4" rx="0.3" />
      <rect x="24.4" y="8" width="3.6" height="2.2" rx="0.3" />
      <rect x="6.4" y="18.4" width="4.6" height="3.2" rx="0.3" />
      <rect x="18.2" y="13.6" width="4.2" height="2.4" rx="0.3" />
      <rect x="13.2" y="23.4" width="4.6" height="2.4" rx="0.3" />
      <rect x="20.2" y="16.6" width="4.2" height="2.6" rx="0.3" />
    </g>
  );
}
