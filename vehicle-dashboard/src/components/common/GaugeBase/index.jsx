import React from 'react';

const GaugeBase = ({
  value = 0,
  min = 0,
  max = 100,
  unit = '',
  ticks = [],
  label = '',
  tickLabelProps = {},
  valueLabelProps = {}
}) => {
  const range = max - min;
  const normalizedValue = (value - min) / range;
  const rotation = -140 + (normalizedValue * 280);

  const generateTicks = () => {
    return ticks.map((tick, index) => {
      const tickAngle = -140 + (index * 280 / (ticks.length - 1));
      const tickRadians = (tickAngle * Math.PI) / 180;
      const x = 100 + 75 * Math.cos(tickRadians);
      const y = 100 + 75 * Math.sin(tickRadians);
      const textAngle = tickAngle >= -90 && tickAngle <= 90 ? tickAngle : tickAngle + 180;

      return (
        <g key={tick} transform={`translate(${x},${y}) rotate(${textAngle})`}>
          <text
            className="fill-gray-400 text-[10px]"  // 縮小刻度字體
            textAnchor="middle"
            dominantBaseline="middle"
            style={tickLabelProps}
          >
            {tick}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="relative">
      <svg
        viewBox="0 0 200 200"
        className="w-full"
      >
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#1f2937"
          strokeWidth="20"
          strokeDasharray="439.6"
          strokeDashoffset="109.9"
        />

        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="20"
          strokeDasharray="439.6"
          strokeDashoffset={439.6 * (1 - normalizedValue)}
          className="transition-all duration-500"
        />

        <circle
          cx="100"
          cy="100"
          r="5"
          fill="#4B5563"
        />

        <g transform={`rotate(${rotation} 100 100)`}>
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke="#EF4444"
            strokeWidth="2"
            className="transition-transform duration-500 ease-in-out"
          />
        </g>

        {generateTicks()}

        <text
          x="100"
          y="125"
          textAnchor="middle"
          className="fill-white text-sm font-bold"  // 縮小中間數值字體
          style={valueLabelProps}
        >
          {`${Math.round(value)}`}
        </text>

        <text
          x="100"
          y="140"
          textAnchor="middle"
          className="fill-gray-400 text-[10px]"  // 縮小單位字體
        >
          {unit}
        </text>

        <text
          x="100"
          y="155"
          textAnchor="middle"
          className="fill-gray-400 text-[10px]"  // 縮小標籤字體
        >
          {label}
        </text>
      </svg>
    </div>
  );
};

export default GaugeBase;