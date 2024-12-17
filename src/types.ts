export interface RibbonBarIconConfig {
	id: string;
	imagePath: string;
	ribbonIcon: string;
}

export interface StatusBarIconConfig {
	id: string;
	imagePath: string;
	statusBarIcon: string;
}

export interface CoreButtonsConfig {
	vaultSwitcherImagePath: string;
	helpIconImagePath: string;
	settingIconImagePath: string;
	leftSidebarToggleImagePath: string;
	rightSidebarToggleImagePath: string;
}

export interface ImagePreviewOnIconHoverSettings {
	RibbonBarIcons: RibbonBarIconConfig[];
	StatusBarIcons: StatusBarIconConfig[];
	CoreButtonsImage: CoreButtonsConfig;
}
