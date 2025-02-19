import { App, Plugin, setIcon, Notice } from "obsidian";
import { ImagePreviewManager } from "./imagePreviewManager";
import { StatusBarIconConfig } from "../types";

export class StatusBarManager {
	private app: App;
	private plugin: Plugin;
	private pluginId: string;
	private imagePreviewManager: ImagePreviewManager;
	private statusBarItems: { [key: string]: HTMLElement } = {};

	constructor(app: App, plugin: Plugin, pluginId: string) {
		this.app = app;
		this.plugin = plugin;
		this.pluginId = pluginId;
		this.imagePreviewManager = new ImagePreviewManager(app);
		this.imagePreviewManager.setupImagePopup();
	}

	mouseEnterHandler(imagePath: string) {
		return () => {
			if (imagePath) {
				this.imagePreviewManager.showImage(imagePath);
			}
		};
	}

	mouseLeaveHandler() {
		return () => {
			this.imagePreviewManager.hideImage();
		};
	}

	setupStatusBarIcons(statusBarIcons: StatusBarIconConfig[]) {
		// Remove existing status bar items
		Object.values(this.statusBarItems).forEach((item) => item.remove());
		this.statusBarItems = {};

		// Add icons from Plugin settings to status bar
		statusBarIcons.forEach((iconConfig) => {
			// Create status bar item
			const statusBarItemEl = this.plugin.addStatusBarItem();
			statusBarItemEl.setText(""); // Clear any default text

			// Set up icon
			const iconContainer = statusBarItemEl.createEl("span", {
				cls: "status-bar-icon-container",
			});
			setIcon(iconContainer, iconConfig.statusBarIcon);

			// Store the status bar item for later management
			this.statusBarItems[iconConfig.id] = statusBarItemEl;

			// Add click event to open image
			statusBarItemEl.addEventListener("click", () => {
				if (iconConfig.imagePath) {
					const { vault } = this.app;
					const imageFile = vault.getFileByPath(iconConfig.imagePath);

					if (imageFile) {
						// Open the image file
						this.app.workspace.openLinkText(iconConfig.imagePath, "", false);
					} else {
						// If file doesn't exist, show a notice
						new Notice("Image file not found", 3000);
					}
				} else {
					// If no image path is set
					new Notice("No image path configured", 3000);
				}
			});

			// Add hover events for image preview
			statusBarItemEl.addEventListener("mouseenter", this.mouseEnterHandler(iconConfig.imagePath));
			statusBarItemEl.addEventListener("mouseleave", this.mouseLeaveHandler());
		});
	}

	updateStatusBarIcon(statusBarIcons: StatusBarIconConfig[], id: string, iconId: string): StatusBarIconConfig[] {
		const updatedIcons = statusBarIcons.map((config) => (config.id === id ? { ...config, statusBarIcon: iconId } : config));
		this.setupStatusBarIcons(updatedIcons);
		return updatedIcons;
	}

	removeStatusBarIcon(statusBarIcons: StatusBarIconConfig[], id: string): StatusBarIconConfig[] {
		// Remove the status bar item
		const itemToRemove = this.statusBarItems[id];
		if (itemToRemove) {
			itemToRemove.remove();
			delete this.statusBarItems[id];
		}

		// Update icons to exclude the removed icon
		const updatedIcons = statusBarIcons.filter((ic) => ic.id !== id);
		this.setupStatusBarIcons(updatedIcons);
		return updatedIcons;
	}

	unload(): void {
		// Clean up image popup and remove all status bar items
		this.imagePreviewManager.cleanup();
		Object.values(this.statusBarItems).forEach((item) => item.remove());
		this.statusBarItems = {};
	}
}
