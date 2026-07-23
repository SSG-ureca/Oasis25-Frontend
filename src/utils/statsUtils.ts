export const generateSvgPath = (data: number[]) => {
  const maxVal = Math.max(...data, 1);
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * 400;
    const y = 130 - (val / maxVal) * 100;
    return { x, y };
  });

  let pathD = `M 0,${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathD += ` L ${points[i].x},${points[i].y}`;
  }

  let pathD2 = `M 0,${points[0].y + 15}`;
  for (let i = 1; i < points.length; i++) {
    pathD2 += ` L ${points[i].x},${Math.min(145, points[i].y + 15)}`;
  }

  return {
    fill1: `${pathD} L 400,150 L 0,150 Z`,
    fill2: `${pathD2} L 400,150 L 0,150 Z`
  };
};
