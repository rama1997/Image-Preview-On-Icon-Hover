import { App, Plugin } from "obsidian";
import { ImagePreviewManager } from "./imagePreviewManager";

export class CoreButtonsManager {
	private app: App;
	private plugin: Plugin;
	private imagePreviewManager: ImagePreviewManager;
	private helpIconElement: Element | null = null;
	private settingIconElement: Element | null = null;
	private vaultSwitcherElement: Element | null = null;
	private leftSidebarToggleElement: Element | null = null;
	private rightSidebarToggleElement: Element | null = null;

	// Store bound event handlers to use in add/remove
	private boundMouseEnterHandler: (event: MouseEvent) => void;
	private boundMouseLeaveHandler: (event: MouseEvent) => void;

	constructor(app: App, plugin: Plugin) {
		this.app = app;
		this.plugin = plugin;
		this.imagePreviewManager = new ImagePreviewManager(app);
		this.imagePreviewManager.setupImagePopup();

		// Find Core Buttons HTMl element
		this.helpIconElement = document.querySelectorAll(".workspace-drawer-vault-actions .clickable-icon")[0];
		this.settingIconElement = document.querySelectorAll(".workspace-drawer-vault-actions .clickable-icon")[1];

		this.vaultSwitcherElement = document.querySelectorAll(".workspace-drawer-vault-switcher")[0];

		this.leftSidebarToggleElement = document.querySelectorAll(".sidebar-toggle-button.mod-left .clickable-icon")[0];
		this.rightSidebarToggleElement = document.querySelectorAll(".sidebar-toggle-button.mod-right .clickable-icon")[0];
	}

	setupHelpIconImagePreview(imagePath: string): void {
		// Ensure previous listeners are removed
		if (this.helpIconElement) {
			this.helpIconElement.removeEventListener("mouseenter", this.boundMouseEnterHandler);
			this.helpIconElement.removeEventListener("mouseleave", this.boundMouseLeaveHandler);
		}

		// Wait for workspace to be ready
		this.app.workspace.onLayoutReady(() => {
			if (this.helpIconElement) {
				// Create bound event handlers
				this.boundMouseEnterHandler = this.mouseEnterHandler(imagePath);
				this.boundMouseLeaveHandler = this.mouseLeaveHandler();

				// Add event listeners using bound methods
				this.helpIconElement.addEventListener("mouseenter", this.boundMouseEnterHandler);
				this.helpIconElement.addEventListener("mouseleave", this.boundMouseLeaveHandler);
			}
		});
	}

	setupSettingIconImagePreview(imagePath: string): void {
		// Ensure previous listeners are removed
		if (this.settingIconElement) {
			this.settingIconElement.removeEventListener("mouseenter", this.boundMouseEnterHandler);
			this.settingIconElement.removeEventListener("mouseleave", this.boundMouseLeaveHandler);
		}

		// Wait for workspace to be ready
		this.app.workspace.onLayoutReady(() => {
			if (this.settingIconElement) {
				// Create bound event handlers
				this.boundMouseEnterHandler = this.mouseEnterHandler(imagePath);
				this.boundMouseLeaveHandler = this.mouseLeaveHandler();

				// Add event listeners using bound methods
				this.settingIconElement.addEventListener("mouseenter", this.boundMouseEnterHandler);
				this.settingIconElement.addEventListener("mouseleave", this.boundMouseLeaveHandler);
			}
		});
	}

	setupVaultSwitcherImagePreview(imagePath: string): void {
		// Ensure previous listeners are removed
		if (this.vaultSwitcherElement) {
			this.vaultSwitcherElement.removeEventListener("mouseenter", this.boundMouseEnterHandler);
			this.vaultSwitcherElement.removeEventListener("mouseleave", this.boundMouseLeaveHandler);
		}

		// Wait for workspace to be ready
		this.app.workspace.onLayoutReady(() => {
			if (this.vaultSwitcherElement) {
				// Create bound event handlers
				this.boundMouseEnterHandler = this.mouseEnterHandler(imagePath);
				this.boundMouseLeaveHandler = this.mouseLeaveHandler();

				// Add event listeners using bound methods
				this.vaultSwitcherElement.addEventListener("mouseenter", this.boundMouseEnterHandler);
				this.vaultSwitcherElement.addEventListener("mouseleave", this.boundMouseLeaveHandler);
			}
		});
	}

	setupLeftSidebarToggleImagePreview(imagePath: string): void {
		// Ensure previous listeners are removed
		if (this.leftSidebarToggleElement) {
			this.leftSidebarToggleElement.removeEventListener("mouseenter", this.boundMouseEnterHandler);
			this.leftSidebarToggleElement.removeEventListener("mouseleave", this.boundMouseLeaveHandler);
		}

		// Wait for workspace to be ready
		this.app.workspace.onLayoutReady(() => {
			if (this.leftSidebarToggleElement) {
				// Create bound event handlers
				this.boundMouseEnterHandler = this.mouseEnterHandler(imagePath);
				this.boundMouseLeaveHandler = this.mouseLeaveHandler();

				// Add event listeners using bound methods
				this.leftSidebarToggleElement.addEventListener("mouseenter", this.boundMouseEnterHandler);
				this.leftSidebarToggleElement.addEventListener("mouseleave", this.boundMouseLeaveHandler);
			}
		});
	}

	setupRightSidebarToggleImagePreview(imagePath: string): void {
		// Ensure previous listeners are removed
		if (this.rightSidebarToggleElement) {
			this.rightSidebarToggleElement.removeEventListener("mouseenter", this.boundMouseEnterHandler);
			this.rightSidebarToggleElement.removeEventListener("mouseleave", this.boundMouseLeaveHandler);
		}

		// Wait for workspace to be ready
		this.app.workspace.onLayoutReady(() => {
			if (this.rightSidebarToggleElement) {
				// Create bound event handlers
				this.boundMouseEnterHandler = this.mouseEnterHandler(imagePath);
				this.boundMouseLeaveHandler = this.mouseLeaveHandler();

				// Add event listeners using bound methods
				this.rightSidebarToggleElement.addEventListener("mouseenter", this.boundMouseEnterHandler);
				this.rightSidebarToggleElement.addEventListener("mouseleave", this.boundMouseLeaveHandler);
			}
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

	removePreviousEventListners(): void {
		if (this.helpIconElement) {
			this.helpIconElement.removeEventListener("mouseenter", this.boundMouseEnterHandler);
			this.helpIconElement.removeEventListener("mouseleave", this.boundMouseLeaveHandler);
		}
		if (this.settingIconElement) {
			this.settingIconElement.removeEventListener("mouseenter", this.boundMouseEnterHandler);
			this.settingIconElement.removeEventListener("mouseleave", this.boundMouseLeaveHandler);
		}
		if (this.vaultSwitcherElement) {
			this.vaultSwitcherElement.removeEventListener("mouseenter", this.boundMouseEnterHandler);
			this.vaultSwitcherElement.removeEventListener("mouseleave", this.boundMouseLeaveHandler);
		}
		if (this.leftSidebarToggleElement) {
			this.leftSidebarToggleElement.removeEventListener("mouseenter", this.boundMouseEnterHandler);
			this.leftSidebarToggleElement.removeEventListener("mouseleave", this.boundMouseLeaveHandler);
		}
		if (this.rightSidebarToggleElement) {
			this.rightSidebarToggleElement.removeEventListener("mouseenter", this.boundMouseEnterHandler);
			this.rightSidebarToggleElement.removeEventListener("mouseleave", this.boundMouseLeaveHandler);
		}
	}

	unload(): void {
		this.removePreviousEventListners();

		// Clean up image popup
		this.imagePreviewManager.cleanup();
	}
}
