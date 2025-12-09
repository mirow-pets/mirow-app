import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MenuItem {
  label: string;
  onPress: () => void;
}

interface Point {
  x: number;
  y: number;
}
function isPoint(anchor: ReactNode | Point): anchor is Point {
  return (
    typeof anchor === "object" &&
    anchor !== null &&
    "x" in anchor &&
    "y" in anchor
  );
}

type MenuPosition = "bottom-left" | "bottom-right" | "top-left" | "top-right";

interface MenuProps {
  isVisible: boolean;
  onDismiss: () => void; // Renamed from onClose
  options: MenuItem[];
  anchor: ReactNode | Point; // Can be a node or coordinates
  position?: MenuPosition;
}

export const Menu = ({
  isVisible,
  onDismiss, // Renamed from onClose
  options,
  anchor,
  position = "bottom-left",
}: MenuProps) => {
  const [menuCoordinates, setMenuCoordinates] = useState({ top: 0, left: 0 });
  const anchorRef = useRef<View>(null); // Ref for the anchor's wrapper View

  const getMenuPosition = useCallback(
    (currentTriggerLayout: {
      x: number;
      y: number;
      width: number;
      height: number;
    }) => {
      const { width: screenWidth, height: screenHeight } =
        Dimensions.get("window");
      const menuWidth = 200; // Approximate menu width, could be calculated dynamically
      const menuHeight = options.length * 40 + 32; // Approximate menu item height + padding

      let top = 0;
      let left = 0;

      if (isPoint(anchor)) {
        top = anchor.y;
        left = anchor.x;
      } else {
        top = currentTriggerLayout.y + currentTriggerLayout.height;
        left = currentTriggerLayout.x;

        switch (position) {
          case "bottom-right":
            left =
              currentTriggerLayout.x + currentTriggerLayout.width - menuWidth;
            break;
          case "top-left":
            top = currentTriggerLayout.y - menuHeight;
            break;
          case "top-right":
            top = currentTriggerLayout.y - menuHeight;
            left =
              currentTriggerLayout.x + currentTriggerLayout.width - menuWidth;
            break;
          case "bottom-left":
          default:
            break;
        }
      }

      if (left + menuWidth > screenWidth) {
        left = screenWidth - menuWidth;
      }
      if (left < 0) {
        left = 0;
      }
      if (top + menuHeight > screenHeight) {
        top = screenHeight - menuHeight;
      }
      if (top < 0) {
        top = 0;
      }

      return { top, left };
    },
    [anchor, position, options.length]
  );

  useEffect(() => {
    if (isVisible) {
      if (isPoint(anchor)) {
        setMenuCoordinates(
          getMenuPosition({ x: anchor.x, y: anchor.y, width: 0, height: 0 })
        );
      } else if (anchorRef.current) {
        anchorRef.current.measureInWindow((x, y, width, height) => {
          const currentTriggerLayout = { x, y, width, height };
          setMenuCoordinates(getMenuPosition(currentTriggerLayout));
        });
      }
    }
  }, [isVisible, anchor, anchorRef, getMenuPosition]);

  return (
    <View style={{ alignSelf: "flex-start" }}>
      {isPoint(anchor) ? null : (
        <View
          ref={anchorRef} // Attach ref here
          // Removed onLayout as we use measureInWindow
          style={{ backgroundColor: "transparent" }} // Keep temporary style for debugging or remove
        >
          {anchor}
        </View>
      )}

      <Modal transparent={true} visible={isVisible} onRequestClose={onDismiss}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onDismiss}
        >
          <View style={[styles.menuContainer, menuCoordinates]}>
            {options.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  item.onPress();
                  onDismiss();
                }}
              >
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  menuContainer: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 200,
    paddingVertical: 8,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
});
