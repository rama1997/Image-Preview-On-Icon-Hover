import { App, Plugin } from "obsidian";
import { ImagePreviewManager } from "./imagePreviewManager";

type Icon = {
	element: Element | null;
	enterHandler: ((event: MouseEvent) => void) | null;
	leaveHandler: ((event: MouseEvent) => void) | null;
};

export class CoreButtonsManager {
	private app: App;
	private plugin: Plugin;
	private imagePreviewManager: ImagePreviewManager;

	// Store all icons and their handlers
	private icons: Map<string, Icon>;

	constructor(app: App, plugin: Plugin) {
		this.app = app;
		this.plugin = plugin;
		this.imagePreviewManager = new ImagePreviewManager(app);
		this.imagePreviewManager.setupImagePopup();

		// Initialize icons when layout is ready, otherwise elements won't be found on startup
		this.app.workspace.onLayoutReady(() => {
			this.icons = new Map([
				[
					"helpIcon",
					{
						element: document.querySelectorAll(".workspace-drawer-vault-actions .clickable-icon")[0] || null,
						enterHandler: null,
						leaveHandler: null,
					},
				],
				[
					"settingIcon",
					{
						element: document.querySelectorAll(".workspace-drawer-vault-actions .clickable-icon")[1] || null,
						enterHandler: null,
						leaveHandler: null,
					},
				],
				[
					"vaultSwitcher",
					{
						element: document.querySelectorAll(".workspace-drawer-vault-switcher")[0] || null,
						enterHandler: null,
						leaveHandler: null,
					},
				],
				[
					"leftSidebarToggle",
					{
						element: document.querySelectorAll(".sidebar-toggle-button.mod-left .clickable-icon")[0] || null,
						enterHandler: null,
						leaveHandler: null,
					},
				],
				[
					"rightSidebarToggle",
					{
						element: document.querySelectorAll(".sidebar-toggle-button.mod-right .clickable-icon")[0] || null,
						enterHandler: null,
						leaveHandler: null,
					},
				],
			]);
		});
	}

	private mouseEnterHandler(imagePath: string) {
		return (event: MouseEvent) => {
			if (imagePath) {
				this.imagePreviewManager.showImage(imagePath);
			}
		};
	}

	private mouseLeaveHandler() {
		return (event: MouseEvent) => {
			this.imagePreviewManager.hideImage();
		};
	}

	private addIconEventListeners(icon: Icon, imagePath: string): void {
		// Only add new listeners if we have an image path
		if (imagePath && icon.element) {
			// Create new handlers
			icon.enterHandler = this.mouseEnterHandler(imagePath);
			icon.leaveHandler = this.mouseLeaveHandler();

			// Add listeners
			icon.element.addEventListener("mouseenter", icon.enterHandler);
			icon.element.addEventListener("mouseleave", icon.leaveHandler);
		}
	}

	private removeIconEventListeners(icon: Icon): void {
		if (!icon.element) return;

		if (icon.enterHandler) {
			icon.element.removeEventListener("mouseenter", icon.enterHandler);
			icon.enterHandler = null;
		}
		if (icon.leaveHandler) {
			icon.element.removeEventListener("mouseleave", icon.leaveHandler);
			icon.leaveHandler = null;
		}
	}

	private setupEventListeners(iconName: string, imagePath: string): void {
		const icon = this.icons.get(iconName);
		if (!icon || !icon.element) return;

		// Remove previous event listeners
		this.removeIconEventListeners(icon);

		// Add new event listeners. Only add new listeners if we have an image path
		if (imagePath && icon) {
			this.addIconEventListeners(icon, imagePath);
		}
	}

	setupHelpIconImagePreview(imagePath: string): void {
		// Wait for workspace to be ready
		this.app.workspace.onLayoutReady(() => {
			this.setupEventListeners("helpIcon", imagePath);
		});
	}

	setupSettingIconImagePreview(imagePath: string): void {
		// Wait for workspace to be ready
		this.app.workspace.onLayoutReady(() => {
			this.setupEventListeners("settingIcon", imagePath);
		});
	}

	setupVaultSwitcherImagePreview(imagePath: string): void {
		// Wait for workspace to be ready
		this.app.workspace.onLayoutReady(() => {
			this.setupEventListeners("vaultSwitcher", imagePath);
		});
	}

	setupLeftSidebarToggleImagePreview(imagePath: string): void {
		// Wait for workspace to be ready
		this.app.workspace.onLayoutReady(() => {
			this.setupEventListeners("leftSidebarToggle", imagePath);
		});
	}

	setupRightSidebarToggleImagePreview(imagePath: string): void {
		// Wait for workspace to be ready
		this.app.workspace.onLayoutReady(() => {
			this.setupEventListeners("rightSidebarToggle", imagePath);
		});
	}

	unload(): void {
		// Remove all listeners
		this.icons.forEach((icon) => this.removeIconEventListeners(icon));

		// Clean up image popup
		this.imagePreviewManager.cleanup();
	}
}
