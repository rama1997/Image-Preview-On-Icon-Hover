import { Plugin } from "obsidian";
import { RibbonBarManager } from "./managers/ribbonBarManager";
import { StatusBarManager } from "./managers/statusBarManager";
import { CoreButtonsManager } from "./managers/coreButtonsManager";
import { ImagePreviewOnIconHoverSettingTab } from "./settingTab";
import { DEFAULT_SETTINGS } from "./constants";
import { ImagePreviewOnIconHoverSettings } from "./types";

export default class ImagePreviewOnIconHoverPlugin extends Plugin {
	settings: ImagePreviewOnIconHoverSettings;
	private pluginId = this.manifest.id;
	private ribbonBarManager: RibbonBarManager;
	private statusBarManager: StatusBarManager;
	private coreButtonsManager: CoreButtonsManager;

	async onload() {
		await this.loadPluginSettings();

		// Initialize Managers
		this.ribbonBarManager = new RibbonBarManager(this.app, this, this.pluginId);
		this.statusBarManager = new StatusBarManager(this.app, this, this.pluginId);
		this.coreButtonsManager = new CoreButtonsManager(this.app, this);

		// Setup core buttons
		this.setupCoreButtonsImagePreview();

		// Setup ribbon and status bar icons
		this.ribbonBarManager.setupRibbonIcons(this.settings.RibbonBarIcons);
		this.statusBarManager.setupStatusBarIcons(this.settings.StatusBarIcons);

		// Add settings tab
		this.addSettingTab(new ImagePreviewOnIconHoverSettingTab(this.app, this));
	}

	async onunload() {
		this.ribbonBarManager.unload();
		this.statusBarManager.unload();
		this.coreButtonsManager.unload();
	}

	private setupCoreButtonsImagePreview() {
		this.coreButtonsManager.setupVaultSwitcherImagePreview(this.settings.CoreButtonsImage.vaultSwitcherImagePath);
		this.coreButtonsManager.setupHelpIconImagePreview(this.settings.CoreButtonsImage.helpIconImagePath);
		this.coreButtonsManager.setupSettingIconImagePreview(this.settings.CoreButtonsImage.settingIconImagePath);
		this.coreButtonsManager.setupLeftSidebarToggleImagePreview(this.settings.CoreButtonsImage.leftSidebarToggleImagePath);
		this.coreButtonsManager.setupRightSidebarToggleImagePreview(this.settings.CoreButtonsImage.rightSidebarToggleImagePath);
	}

	async updateVaultSwitcherImagePath(imagePath: string): Promise<boolean> {
		this.settings.CoreButtonsImage.vaultSwitcherImagePath = imagePath;
		await this.savePluginSettings();
		this.coreButtonsManager.setupVaultSwitcherImagePreview(imagePath);
		return true;
	}

	async updateHelpIconImagePath(imagePath: string): Promise<boolean> {
		this.settings.CoreButtonsImage.helpIconImagePath = imagePath;
		await this.savePluginSettings();
		this.coreButtonsManager.setupHelpIconImagePreview(imagePath);
		return true;
	}

	async updateSettingIconImagePath(imagePath: string): Promise<boolean> {
		this.settings.CoreButtonsImage.settingIconImagePath = imagePath;
		await this.savePluginSettings();
		this.coreButtonsManager.setupSettingIconImagePreview(imagePath);
		return true;
	}

	async updateLeftSidebarToggleImagePath(imagePath: string): Promise<boolean> {
		this.settings.CoreButtonsImage.leftSidebarToggleImagePath = imagePath;
		await this.savePluginSettings();
		this.coreButtonsManager.setupLeftSidebarToggleImagePreview(imagePath);
		return true;
	}

	async updateRightSidebarToggleImagePath(imagePath: string): Promise<boolean> {
		this.settings.CoreButtonsImage.rightSidebarToggleImagePath = imagePath;
		await this.savePluginSettings();
		this.coreButtonsManager.setupRightSidebarToggleImagePreview(imagePath);
		return true;
	}

	async addNewRibbonIcon() {
		const id = "ImageOnIconHover" + `${Date.now()}`;
		this.settings.RibbonBarIcons.push({
			id,
			imagePath: "",
			ribbonIcon: "image",
		});
		await this.savePluginSettings();
		this.ribbonBarManager.setupRibbonIcons(this.settings.RibbonBarIcons);
	}

	async removeRibbonIcon(id: string) {
		this.settings.RibbonBarIcons = this.ribbonBarManager.removeRibbonIcon(this.settings.RibbonBarIcons, id);
		await this.savePluginSettings();
	}

	async updateRibbonIcon(id: string, iconId: string): Promise<boolean> {
		this.settings.RibbonBarIcons = this.ribbonBarManager.updateRibbonIcon(this.settings.RibbonBarIcons, id, iconId);
		await this.savePluginSettings();
		return true;
	}

	async updateRibbonIconImagePath(id: string, imagePath: string): Promise<boolean> {
		const iconConfig = this.settings.RibbonBarIcons.find((ic) => ic.id === id);
		if (iconConfig) {
			iconConfig.imagePath = imagePath;
			await this.savePluginSettings();
			this.ribbonBarManager.setupRibbonIcons(this.settings.RibbonBarIcons);
			return true;
		}
		return false;
	}

	async addNewStatusBarIcon() {
		const id = "ImageOnIconHover" + `${Date.now()}`;
		this.settings.StatusBarIcons.push({
			id,
			imagePath: "",
			statusBarIcon: "image",
		});
		await this.savePluginSettings();
		this.statusBarManager.setupStatusBarIcons(this.settings.StatusBarIcons);
	}

	async removeStatusBarIcon(id: string) {
		this.settings.StatusBarIcons = this.statusBarManager.removeStatusBarIcon(this.settings.StatusBarIcons, id);
		await this.savePluginSettings();
	}

	async updateStatusBarIcon(id: string, iconId: string): Promise<boolean> {
		this.settings.StatusBarIcons = this.statusBarManager.updateStatusBarIcon(this.settings.StatusBarIcons, id, iconId);
		await this.savePluginSettings();
		return true;
	}

	async updateStatusBarIconImagePath(id: string, imagePath: string): Promise<boolean> {
		const iconConfig = this.settings.StatusBarIcons.find((ic) => ic.id === id);
		if (iconConfig) {
			iconConfig.imagePath = imagePath;
			await this.savePluginSettings();
			this.statusBarManager.setupStatusBarIcons(this.settings.StatusBarIcons);
			return true;
		}
		return false;
	}

	async loadPluginSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async savePluginSettings() {
		await this.saveData(this.settings);
	}
}
