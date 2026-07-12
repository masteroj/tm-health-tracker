import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatusPill({ label, color, soft, style }) {
  return (
    <View style={[styles.pill, { backgroundColor: soft }, style]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  text: { fontSize: 12, fontWeight: '700' },
});
