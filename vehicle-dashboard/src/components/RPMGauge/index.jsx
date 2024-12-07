import React, { memo } from 'react';
import GaugeBase from '../common/GaugeBase';

const RPMGauge = memo(({ value }) => {
  const displayValue = Math.round(value);

  return (
    <GaugeBase
      value={displayValue}
      min={0}
      max={6000}
      unit="RPM"
      label="Motor Speed"
      ticks={[0, 1500, 3000, 4500, 6000]}
    />
  );
});

RPMGauge.displayName = 'RPMGauge';
export default RPMGauge;