import { Text } from "react-native";

type IconName =
  | "arrow_forward"
  | "check_circle"
  | "dark_mode"
  | "fitness_center"
  | "light_mode"
  | "speed"
  | "trending_up";

const GLYPHS: Record<IconName, string> = {
  arrow_forward: "\ue5c8",
  check_circle: "\uf0be",
  dark_mode: "\ue51c",
  fitness_center: "\ueb43",
  light_mode: "\ue518",
  speed: "\ue9e4",
  trending_up: "\ue8e5",
};

type MaterialIconProps = {
  name: IconName;
  className?: string;
  medium?: boolean;
};

export function MaterialIcon({ name, className, medium = false }: MaterialIconProps) {
  return (
    <Text
      className={`${medium ? "font-icon-medium" : "font-icon"} ${className ?? ""}`}
      selectable={false}
      accessibilityElementsHidden>
      {GLYPHS[name]}
    </Text>
  );
}
