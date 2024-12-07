import React, { memo } from 'react';
import GaugeBase from '../common/GaugeBase';

const PowerGauge = memo(({ value }) => {
  const maxPower = 1000;
  const isCharging = value < 0;
  const displayValue = Math.round(Math.abs(value));

  return (
    <GaugeBase
      value={displayValue}
      min={-maxPower}
      max={maxPower}
      unit="kW"
      label={isCharging ? "Charging" : "Consuming"}
      ticks={[-1000, -500, 0, 500, 1000]}
    />
  );
});

PowerGauge.displayName = 'PowerGauge';
export default PowerGauge;