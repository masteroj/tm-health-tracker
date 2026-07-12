import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle, Line, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme';

/**
 * series: [{ color, points: number[] }]  (all series share the same x labels)
 * labels: string[]  (x-axis labels aligned to point index)
 */
export default function LineChart({ series = [], labels = [], height = 180, yUnit = '' }) {
  const [width, setWidth] = useState(0);
  const pad = { l: 38, r: 12, t: 12, b: 22 };

  const allVals = series.flatMap((s) => s.points).filter((v) => v != null);
  const hasData = allVals.length > 0;

  let min = hasData ? Math.min(...allVals) : 0;
  let max = hasData ? Math.max(...allVals) : 1;
  const span = max - min || 1;
  min = min - span * 0.12;
  max = max + span * 0.12;
  if (min < 0 && allVals.every((v) => v >= 0)) min = 0;

  const n = labels.length;
  const plotW = Math.max(1, width - pad.l - pad.r);
  const plotH = height - pad.t - pad.b;
  const xAt = (i) => pad.l + (n <= 1 ? plotW / 2 : (plotW * i) / (n - 1));
  const yAt = (v) => pad.t + plotH * (1 - (v - min) / (max - min));

  const gridLines = [0, 1, 2, 3, 4];

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && (
        <Svg width={width} height={height}>
          {/* horizontal grid + y labels */}
          {gridLines.map((i) => {
            const y = pad.t + (plotH * i) / 4;
            const val = max - ((max - min) * i) / 4;
            return (
              <React.Fragment key={i}>
                <Line x1={pad.l} y1={y} x2={width - pad.r} y2={y} stroke={colors.border} strokeWidth={1} />
                <SvgText x={pad.l - 6} y={y + 3} fontSize={10} fill={colors.muted} textAnchor="end">
                  {Math.round(val)}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* x labels (thinned) */}
          {labels.map((lb, i) => {
            if (n > 7 && i % Math.ceil(n / 6) !== 0 && i !== n - 1) return null;
            return (
              <SvgText key={`x${i}`} x={xAt(i)} y={height - pad.b + 14} fontSize={10} fill={colors.muted} textAnchor="middle">
                {lb}
              </SvgText>
            );
          })}

          {/* series */}
          {hasData &&
            series.map((s, si) => {
              const pts = s.points
                .map((v, i) => (v == null ? null : `${xAt(i)},${yAt(v)}`))
                .filter(Boolean)
                .join(' ');
              return (
                <React.Fragment key={si}>
                  <Polyline points={pts} fill="none" stroke={s.color} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
                  {s.points.map((v, i) =>
                    v == null ? null : <Circle key={i} cx={xAt(i)} cy={yAt(v)} r={3} fill={s.color} />
                  )}
                </React.Fragment>
              );
            })}
        </Svg>
      )}
      {!hasData && (
        <View style={[styles.empty, { height }]}>
          <Text style={styles.emptyText}>No data in this range</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.muted, fontSize: 13 },
});
