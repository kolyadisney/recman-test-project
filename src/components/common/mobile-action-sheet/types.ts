export interface ActionItem {
  id: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export interface MobileActionSheetProps {
  isOpen: boolean;
  title?: string;
  actions: ActionItem[];
  onClose: () => void;
}
