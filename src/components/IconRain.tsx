import { STACK_ICON_LIST } from "@/components/icons";

// Fixed, not Math.random() — this renders on the server first and the
// values need to match on the client.
const RAIN_ITEMS = [
  { icon: 0, left: 2, size: 16, duration: 12, delay: -1 },
  { icon: 1, left: 9, size: 20, duration: 15, delay: -6 },
  { icon: 2, left: 16, size: 14, duration: 18, delay: -11 },
  { icon: 3, left: 23, size: 24, duration: 21, delay: -3 },
  { icon: 4, left: 30, size: 18, duration: 14, delay: -9 },
  { icon: 5, left: 37, size: 22, duration: 17, delay: -14 },
  { icon: 6, left: 44, size: 15, duration: 20, delay: -2 },
  { icon: 7, left: 51, size: 19, duration: 13, delay: -8 },
  { icon: 8, left: 58, size: 26, duration: 16, delay: -13 },
  { icon: 9, left: 65, size: 17, duration: 19, delay: -5 },
  { icon: 0, left: 72, size: 21, duration: 22, delay: -10 },
  { icon: 1, left: 79, size: 14, duration: 11, delay: -15 },
  { icon: 2, left: 86, size: 23, duration: 15, delay: -4 },
  { icon: 3, left: 93, size: 16, duration: 18, delay: -7 },
  { icon: 4, left: 5, size: 20, duration: 21, delay: -12 },
  { icon: 5, left: 13, size: 18, duration: 14, delay: -0.5 },
  { icon: 6, left: 27, size: 15, duration: 17, delay: -6.5 },
  { icon: 7, left: 41, size: 24, duration: 20, delay: -11.5 },
  { icon: 8, left: 55, size: 19, duration: 13, delay: -2.5 },
  { icon: 9, left: 69, size: 22, duration: 16, delay: -9.5 },
  { icon: 0, left: 83, size: 17, duration: 19, delay: -14.5 },
  { icon: 1, left: 97, size: 21, duration: 12, delay: -3.5 },
  { icon: 2, left: 20, size: 14, duration: 15, delay: -8.5 },
  { icon: 3, left: 60, size: 20, duration: 18, delay: -13.5 },
] as const;

export function IconRain() {
  return (
    <div className="icon-rain" aria-hidden>
      {RAIN_ITEMS.map((item, index) => {
        const { Icon, color } = STACK_ICON_LIST[item.icon];
        return (
          <span
            key={index}
            className="icon-rain-item"
            style={{
              left: `${item.left}%`,
              width: item.size,
              height: item.size,
              color,
              opacity: index % 2 === 0 ? 0.32 : 0.18,
              animationDuration: `${item.duration}s`,
              animationDelay: `${item.delay}s`,
            }}
          >
            <Icon />
          </span>
        );
      })}
    </div>
  );
}
