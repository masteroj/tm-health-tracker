import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, radius, space } from '../theme';

// value: Date, onChange: (Date) => void
export default function DateTimeField({ value, onChange }) {
  const [show, setShow] = useState(null); // 'date' | 'time' | null

  const handle = (event, selected) => {
    // Android fires with type 'dismissed' on cancel
    if (Platform.OS === 'android') setShow(null);
    if (event.type === 'dismissed' || !selected) return;
    const next = new Date(value);
    if (show === 'date') {
      next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
    } else {
      next.setHours(selected.getHours(), selected.getMinutes());
    }
    onChange(next);
  };

  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.btn} onPress={() => setShow('date')}>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>
          {value.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => setShow('time')}>
        <Text style={styles.label}>Time</Text>
        <Text style={styles.value}>
          {value.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={value}
          mode={show}
          is24Hour={false}
          onChange={handle}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm },
  btn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FBFCFE',
  },
  label: { fontSize: 11, color: colors.muted, marginBottom: 2 },
  value: { fontSize: 15, color: colors.text, fontWeight: '600' },
});
