// Hand-drawn SVG charts for HomeBudget: a spending donut and a grouped
// income-vs-spending bar chart. No library, no network, pure arithmetic.

export function donutChart(slices, size = 220) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r - 34;
  let angle = -Math.PI / 2;
  let paths = '';
  for (const s of slices) {
    if (s.value <= 0 || total <= 0) continue;
    const a0 = angle;
    const a1 = angle + (s.value / total) * Math.PI * 2;
    angle = a1;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    paths += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${s.color}"><title>${s.label}: $${s.value.toFixed(2)}</title></path>`;
  }
  const legend = slices
    .map(
      (s) =>
        `<li><span class="dot" style="background:${s.color}"></span>${s.label} — $${s.value.toFixed(2)} (${((s.value / total) * 100).toFixed(1)}%)</li>`,
    )
    .join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending by category chart">${paths}<text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-centre-big">$${total.toFixed(0)}</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-centre-small">spent in November</text></svg><ul class="legend">${legend}</ul></div>`;
}

export function barsChart(rows, width = 640, height = 260) {
  const max = Math.max(...rows.flatMap((r) => [r.income, r.spent])) * 1.08;
  const padL = 52;
  const padB = 28;
  const padT = 14;
  const chartH = height - padB - padT;
  const slot = (width - padL - 8) / rows.length;
  const barW = Math.min(30, slot * 0.32);
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = padT + chartH * (1 - f);
    return `<line x1="${padL}" y1="${y}" x2="${width - 8}" y2="${y}" class="grid"/><text x="${padL - 6}" y="${y + 4}" text-anchor="end" class="axis">$${Math.round((max * f) / 1000)}k</text>`;
  }).join('');
  const bars = rows
    .map((r, i) => {
      const x = padL + i * slot + (slot - barW * 2 - 6) / 2;
      const hi = (r.income / max) * chartH;
      const hs = (r.spent / max) * chartH;
      return `<rect x="${x.toFixed(1)}" y="${(padT + chartH - hi).toFixed(1)}" width="${barW}" height="${hi.toFixed(1)}" fill="#2f6f5e"><title>${r.month} income $${r.income.toFixed(2)}</title></rect><rect x="${(x + barW + 6).toFixed(1)}" y="${(padT + chartH - hs).toFixed(1)}" width="${barW}" height="${hs.toFixed(1)}" fill="#e0a458"><title>${r.month} spent $${r.spent.toFixed(2)}</title></rect><text x="${(padL + i * slot + slot / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle" class="axis">${r.month}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${width} ${height}" class="bars" role="img" aria-label="Income and spending by month chart">${grid}${bars}<line x1="${padL}" y1="${padT + chartH}" x2="${width - 8}" y2="${padT + chartH}" class="axis-line"/></svg>
  <p class="chart-key"><span class="dot" style="background:#2f6f5e"></span> Income <span class="dot" style="background:#e0a458"></span> Spending</p>`;
}
