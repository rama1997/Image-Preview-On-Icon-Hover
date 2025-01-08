import { App, Plugin, Notice } from "obsidian";
import { ImagePreviewManager } from "./imagePreviewManager";
import { RibbonBarIconConfig } from "./types";

export class RibbonBarManager {
	private app: App;
	private plugin: Plugin;
	private pluginId: string;
	private imagePreviewManager: ImagePreviewManager;

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

	setupRibbonIcons(ribbonIcons: RibbonBarIconConfig[]) {
		// Add icons from Plugin settings to ribbon bar
		ribbonIcons.forEach((iconConfig) => {
			const ribbonIconEl = this.plugin.addRibbonIcon(iconConfig.ribbonIcon, `${iconConfig.id}`, () => {
				// Open image file when icon is clicked
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

			if (ribbonIconEl) {
				ribbonIconEl.addEventListener("mouseenter", this.mouseEnterHandler(iconConfig.imagePath));
				ribbonIconEl.addEventListener("mouseleave", this.mouseLeaveHandler());
			}
		});
	}

	updateRibbonIcon(ribbonIcons: RibbonBarIconConfig[], id: string, iconId: string): RibbonBarIconConfig[] {
		const updatedIcons = ribbonIcons.map((config) => (config.id === id ? { ...config, ribbonIcon: iconId } : config));
		this.setupRibbonIcons(updatedIcons);
		return updatedIcons;
	}

	removeRibbonIcon(ribbonIcons: RibbonBarIconConfig[], id: string): RibbonBarIconConfig[] {
		// Remove Ribbon Icon
		const leftRibbon: any = (this.app.workspace as any).leftRibbon;

		if (leftRibbon?.items) {
			const icon = leftRibbon.items.find((icon: any) => icon.id === `${this.pluginId}:${id}`);
			if (icon) {
				icon.buttonEl.remove();
				leftRibbon.removeRibbonAction(`${this.pluginId}:${id}`);
				leftRibbon.items = leftRibbon.items.filter((icon: any) => icon.id !== `${this.pluginId}:${id}`);
			}
		}

		// Update icons to exclude the removed icon
		const updatedIcons = ribbonIcons.filter((ic) => ic.id !== id);
		this.setupRibbonIcons(updatedIcons);
		return updatedIcons;
	}

	unload(): void {
		this.imagePreviewManager.cleanup();
	}
}
