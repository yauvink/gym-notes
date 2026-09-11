import { Box, IconButton, Typography } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';

const WEIGHT_MIN = 10;
const WEIGHT_MAX = 300;
const WEIGHT_STEP = 0.1;
const ITEM_HEIGHT = 44;
const VISIBLE = 5;
const CENTER_LOCK = 0.08;

const WEIGHT_COUNT = Math.round((WEIGHT_MAX - WEIGHT_MIN) / WEIGHT_STEP) + 1;

function weightAt(index: number) {
  return Number((WEIGHT_MIN + index * WEIGHT_STEP).toFixed(1));
}

function indexOfWeight(value: number) {
  const raw = Math.round((value - WEIGHT_MIN) / WEIGHT_STEP);
  return Math.min(WEIGHT_COUNT - 1, Math.max(0, raw));
}

function WeightWheelPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const ignoreScroll = useRef(false);
  const selectedIndex = indexOfWeight(value);
  const [centeredIndex, setCenteredIndex] = useState(selectedIndex);

  const items = useMemo(() => Array.from({ length: WEIGHT_COUNT }, (_, index) => weightAt(index)), []);

  const scrollToIndex = (index: number, smooth: boolean) => {
    const node = listRef.current;
    if (!node) {
      return;
    }
    ignoreScroll.current = true;
    node.scrollTo({
      top: index * ITEM_HEIGHT,
      behavior: smooth ? 'smooth' : 'auto',
    });
    window.setTimeout(() => {
      ignoreScroll.current = false;
    }, smooth ? 280 : 40);
  };

  useEffect(() => {
    scrollToIndex(indexOfWeight(value), false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only align on mount
  }, []);

  const commitIndex = (index: number, smooth = true) => {
    const nextIndex = Math.min(WEIGHT_COUNT - 1, Math.max(0, index));
    onChange(weightAt(nextIndex));
    setCenteredIndex(nextIndex);
    scrollToIndex(nextIndex, smooth);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 }}>
      <IconButton
        aria-label="Increase weight"
        disabled={selectedIndex >= WEIGHT_COUNT - 1}
        onClick={() => commitIndex(selectedIndex + 1)}
        sx={{ width: 44, height: 44 }}
      >
        <Box
          component="span"
          sx={{
            width: 12,
            height: 12,
            borderLeft: '2px solid currentColor',
            borderTop: '2px solid currentColor',
            transform: 'rotate(45deg) translateY(3px)',
          }}
        />
      </IconButton>

      <Box sx={{ position: 'relative', width: '100%', maxWidth: 220, overflow: 'hidden' }}>
        <Box
          aria-hidden
          sx={{
            pointerEvents: 'none',
            position: 'absolute',
            left: 8,
            right: 8,
            top: '50%',
            height: ITEM_HEIGHT,
            mt: `${-ITEM_HEIGHT / 2}px`,
            borderRadius: 999,
            bgcolor: 'var(--tabbar-selected)',
            border: '0.5px solid var(--glass-border)',
            zIndex: 0,
          }}
        />
        <Box
          ref={listRef}
          aria-hidden
          onScroll={() => {
            if (!listRef.current) {
              return;
            }
            const raw = listRef.current.scrollTop / ITEM_HEIGHT;
            const nearest = Math.min(WEIGHT_COUNT - 1, Math.max(0, Math.round(raw)));
            const atCenter = Math.abs(raw - nearest) <= CENTER_LOCK;
            setCenteredIndex(atCenter ? nearest : -1);
            if (ignoreScroll.current || !atCenter) {
              return;
            }
            const nextValue = weightAt(nearest);
            if (nextValue !== value) {
              onChange(nextValue);
            }
          }}
          sx={{
            position: 'relative',
            zIndex: 1,
            height: ITEM_HEIGHT * VISIBLE,
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollSnapType: 'y mandatory',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Box sx={{ height: ITEM_HEIGHT * 2 }} />
          {items.map((item, index) => {
            const selected = index === centeredIndex;
            return (
              <Box
                key={item}
                onClick={() => commitIndex(indexOfWeight(item))}
                sx={{
                  height: ITEM_HEIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  scrollSnapAlign: 'center',
                  cursor: 'pointer',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: 22,
                    fontWeight: selected ? 700 : 560,
                    letterSpacing: '-0.03em',
                    color: selected ? 'text.primary' : 'text.secondary',
                    opacity: selected ? 1 : 0.4,
                    fontVariantNumeric: 'tabular-nums',
                    transform: selected ? 'scale(1.22)' : 'scale(1)',
                    transformOrigin: 'center',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transition: 'transform 120ms ease, opacity 120ms ease',
                  }}
                >
                  {item.toFixed(1)}
                </Box>
              </Box>
            );
          })}
          <Box sx={{ height: ITEM_HEIGHT * 2 }} />
        </Box>
        <Box
          aria-hidden
          sx={{
            pointerEvents: 'none',
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: ITEM_HEIGHT * 1.6,
            zIndex: 2,
            background: 'linear-gradient(to bottom, var(--glass-bg-strong), transparent)',
          }}
        />
        <Box
          aria-hidden
          sx={{
            pointerEvents: 'none',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: ITEM_HEIGHT * 1.6,
            zIndex: 2,
            background: 'linear-gradient(to top, var(--glass-bg-strong), transparent)',
          }}
        />
        <Typography
          sx={{
            position: 'absolute',
            right: 22,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            fontSize: 13,
            fontWeight: 700,
            color: 'text.secondary',
            pointerEvents: 'none',
          }}
        >
          kg
        </Typography>
      </Box>

      <IconButton
        aria-label="Decrease weight"
        disabled={selectedIndex <= 0}
        onClick={() => commitIndex(selectedIndex - 1)}
        sx={{ width: 44, height: 44 }}
      >
        <Box
          component="span"
          sx={{
            width: 12,
            height: 12,
            borderLeft: '2px solid currentColor',
            borderTop: '2px solid currentColor',
            transform: 'rotate(-135deg) translateY(3px)',
          }}
        />
      </IconButton>
    </Box>
  );
}

export default WeightWheelPicker;
