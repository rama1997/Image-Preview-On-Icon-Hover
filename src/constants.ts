import { ImagePreviewOnIconHoverSettings } from "./types";

export const DEFAULT_SETTINGS: ImagePreviewOnIconHoverSettings = {
	RibbonBarIcons: [
		{
			id: `${Date.now()}`,
			imagePath: "",
			ribbonIcon: "image",
		},
	],
	StatusBarIcons: [
		{
			id: `${Date.now()}`,
			imagePath: "",
			statusBarIcon: "image",
		},
	],
	CoreButtonsImage: { vaultSwitcherImagePath: "", helpIconImagePath: "", settingIconImagePath: "", leftSidebarToggleImagePath: "", rightSidebarToggleImagePath: "" },
};
