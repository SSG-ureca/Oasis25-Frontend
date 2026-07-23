export const smoothData = (data: number[]) => {
  const smoothed = new Array(24).fill(0);
  const kernel = [0.05, 0.12, 0.2, 0.26, 0.2, 0.12, 0.05];
  const kernelRadius = Math.floor(kernel.length / 2);

  for (let i = 0; i < 24; i++) {
    let sum = 0;
    let weightSum = 0;
    for (let k = 0; k < kernel.length; k++) {
      const idx = i + k - kernelRadius;
      if (idx >= 0 && idx < 24) {
        sum += data[idx] * kernel[k];
        weightSum += kernel[k];
      }
    }
    smoothed[i] = sum / weightSum;
  }
  return smoothed;
};

export const generateSvgPath = (data: number[], globalMax?: number) => {
  const BASELINE_Y = 145;
  const MAX_HEIGHT = 135; // 그래프를 높여서 공간을 꽉 채우기 위한 픽셀 높이

  // 1. 24시간 데이터에 가우시안 스무딩을 적용해 완만한 곡선 흐름 생성
  const smoothed = smoothData(data);

  // 2. 24개 시간 노드를 SVG 좌표계로 매핑 (전역 최대치를 기준으로 요일 간 일관된 스케일 유지)
  const maxVal = globalMax ?? Math.max(...smoothed, 1);
  const points = smoothed.map((val, hour) => {
    const x = (hour / 23) * 400;
    const y = Math.min(BASELINE_Y, BASELINE_Y - (val / maxVal) * MAX_HEIGHT);
    return { x, y };
  });

  // 3. 캣멀롬 스플라인(Catmull-Rom) 방식으로 부드러운 베지에 곡선 경로 생성
  let pathD = `M ${points[0].x},${points[0].y}`;
  const tension = 0.22;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) * tension;
    // 제어점의 y 좌표가 바닥선을 초과해 그래프가 지면 아래로 dipping되는 오버슈트 방지
    const cp1y = Math.min(BASELINE_Y, p1.y + (p2.y - p0.y) * tension);
    
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = Math.min(BASELINE_Y, p2.y - (p3.y - p1.y) * tension);

    pathD += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }

  return {
    line: pathD,
    fill: `M 0,${BASELINE_Y} L ${points[0].x},${points[0].y} ${pathD.slice(pathD.indexOf('C'))} L 400,${BASELINE_Y} Z`
  };
};

export const smoothTrendData = (data: number[]) => {
  const smoothed = new Array(data.length).fill(0);
  const kernel = [0.15, 0.7, 0.15];
  const radius = 1;
  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let weight = 0;
    for (let k = -radius; k <= radius; k++) {
      const idx = i + k;
      if (idx >= 0 && idx < data.length) {
        sum += data[idx] * kernel[k + radius];
        weight += kernel[k + radius];
      }
    }
    smoothed[i] = sum / weight;
  }
  return smoothed;
};

export const generateTrendPath = (data: number[]) => {
  if (data.length === 0) {
    return {
      fill: "M 0,145 L 400,145 Z",
      line: "M 0,145 L 400,145"
    };
  }

  const BASELINE_Y = 145;
  const maxVal = Math.max(...data, 60);
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 400;
    const y = Math.min(BASELINE_Y, Math.max(5, BASELINE_Y - (val / maxVal) * 130));
    return { x, y };
  });

  let pathD = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathD += ` L ${points[i].x},${points[i].y}`;
  }

  return {
    line: pathD,
    fill: `M 0,${BASELINE_Y} L ${points[0].x},${points[0].y} ${pathD.slice(pathD.indexOf('L'))} L 400,${BASELINE_Y} Z`
  };
};
