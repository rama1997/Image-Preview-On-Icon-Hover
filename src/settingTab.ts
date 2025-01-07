import { App, Setting, setIcon, getIconIds, Notice, PluginSettingTab } from "obsidian";
import ImagePreviewOnIconHoverPlugin from "./main";

export class ImagePreviewOnIconHoverSettingTab extends PluginSettingTab {
	private plugin: ImagePreviewOnIconHoverPlugin;
	containerEl: HTMLElement;

	constructor(app: App, plugin: ImagePreviewOnIconHoverPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.containerEl = this.containerEl;
	}

	display(): void {
		this.containerEl.empty();

		this.setupRibbonIconSetting();
		this.setupStatusBarSetting();
		this.setupCoreButtonsSetting();
	}

	private setupCoreButtonsSetting() {
		this.containerEl.createEl("h2", { text: "Obsidian icons" });

		this.setupLeftSidebarToggleSetting();
		this.setupRightSidebarToggleSetting();
		this.setupVaultSwitcherSetting();
		this.setupHelpIconSetting();
		this.setupSettingIconSetting();
	}

	private setupLeftSidebarToggleSetting() {
		const leftSidebarToggleSetting = new Setting(this.containerEl).setName("Left sidebar toggle icon").setDesc("Assign an image to display when hovering over the left sidebar toggle icon");

		leftSidebarToggleSetting.addText((text) =>
			text
				.setPlaceholder("images/example.png")
				.setValue(this.plugin.settings.CoreButtonsImage.leftSidebarToggleImagePath)
				.onChange(async (value) => {
					await this.plugin.updateLeftSidebarToggleImagePath(value);
				}),
		);
	}

	private setupRightSidebarToggleSetting() {
		const rightSidebarToggleSetting = new Setting(this.containerEl).setName("Right sidebar toggle icon").setDesc("Assign an image to display when hovering over the righ sidebar toggle icon");

		rightSidebarToggleSetting.addText((text) =>
			text
				.setPlaceholder("images/example.png")
				.setValue(this.plugin.settings.CoreButtonsImage.rightSidebarToggleImagePath)
				.onChange(async (value) => {
					await this.plugin.updateRightSidebarToggleImagePath(value);
				}),
		);
	}

	private setupVaultSwitcherSetting() {
		const vaultNameSetting = new Setting(this.containerEl).setName("Vault switcher").setDesc("Assign an image to display when hovering over the vault switcher");

		vaultNameSetting.addText((text) =>
			text
				.setPlaceholder("images/example.png")
				.setValue(this.plugin.settings.CoreButtonsImage.vaultSwitcherImagePath)
				.onChange(async (value) => {
					await this.plugin.updateVaultSwitcherImagePath(value);
				}),
		);
	}

	private setupHelpIconSetting() {
		const helpIconSetting = new Setting(this.containerEl).setName("Help icon").setDesc("Assign an image to display when hovering over the help icon");

		helpIconSetting.addText((text) =>
			text
				.setPlaceholder("images/example.png")
				.setValue(this.plugin.settings.CoreButtonsImage.helpIconImagePath)
				.onChange(async (value) => {
					await this.plugin.updateHelpIconImagePath(value);
				}),
		);
	}

	private setupSettingIconSetting() {
		const settingIconSetting = new Setting(this.containerEl).setName("Setting icon").setDesc("Assign an image to display when hovering over the setting icon");

		settingIconSetting.addText((text) =>
			text
				.setPlaceholder("images/example.png")
				.setValue(this.plugin.settings.CoreButtonsImage.settingIconImagePath)
				.onChange(async (value) => {
					await this.plugin.updateSettingIconImagePath(value);
				}),
		);
	}

	private setupRibbonIconSetting() {
		this.containerEl.createEl("h2", { text: "Ribbon bar icons" });

		// Add "Add New Icon" button at the top
		new Setting(this.containerEl).setName(`Add new ribbon bar icon`).addButton((button) => {
			button.setButtonText("+").onClick(async () => {
				await this.plugin.addNewRibbonIcon();
				this.display();
			});
		});

		// Display settings for each icon
		this.plugin.settings.RibbonBarIcons.forEach((iconConfig) => {
			const iconSetting = new Setting(this.containerEl).setName(`Ribbon bar icon`).setDesc("Assign an image to display when hovering the ribbon icon");

			// Add image path input
			this.addImagePathInput(iconSetting, (id, imagePath) => this.plugin.updateRibbonIconImagePath(id, imagePath), iconConfig);

			// Add icon picker button
			this.createIconPicker(iconSetting, (id, iconId) => this.plugin.updateRibbonIcon(id, iconId), iconConfig, "ribbonIcon");

			// Add delete button to icon setting
			this.addDeleteButton(iconSetting, (id) => this.plugin.removeRibbonIcon(id), iconConfig);
		});
	}

	private setupStatusBarSetting() {
		this.containerEl.createEl("h2", { text: "Status bar icons" });

		// Add "Add New Icon" button at the top
		new Setting(this.containerEl).setName(`Add new status bar icon`).addButton((button) => {
			button.setButtonText("+").onClick(async () => {
				await this.plugin.addNewStatusBarIcon();
				this.display();
			});
		});

		// Display settings for each icon
		this.plugin.settings.StatusBarIcons.forEach((iconConfig) => {
			const iconSetting = new Setting(this.containerEl).setName(`Status bar icon`).setDesc("Assign an image to display when hovering the status bar icon");

			// Add image path input
			this.addImagePathInput(iconSetting, (id, imagePath) => this.plugin.updateStatusBarIconImagePath(id, imagePath), iconConfig);

			// Add icon picker button
			this.createIconPicker(iconSetting, (id, iconId) => this.plugin.updateStatusBarIcon(id, iconId), iconConfig, "statusBarIcon");

			// Add delete button to icon setting
			this.addDeleteButton(iconSetting, (id) => this.plugin.removeStatusBarIcon(id), iconConfig);
		});
	}

	private addImagePathInput(iconSetting: Setting, updateImagePath: (id: string, imagePath: string) => Promise<boolean>, iconConfig: any) {
		iconSetting.addText((text) =>
			text
				.setPlaceholder("images/example.png")
				.setValue(iconConfig.imagePath)
				.onChange(async (value) => {
					await updateImagePath(iconConfig.id, value);
				}),
		);
	}

	private createIconPicker(iconSetting: Setting, updateIcon: (id: string, iconId: string) => Promise<boolean>, iconConfig: any, iconTypeKey: string) {
		// Create the icon button
		const iconButton = iconSetting.controlEl.createEl("button", {
			cls: "icon-picker-button",
		});

		// Create the current icon preview
		const currentIconContainer = iconButton.createEl("span", {
			cls: "current-icon",
		});
		setIcon(currentIconContainer, iconConfig[iconTypeKey]);

		// Create the dropdown container
		const dropdownContainer = iconSetting.controlEl.createEl("div", {
			cls: "icon-picker-dropdown",
		});

		// Add search input to dropdown
		const searchInput = dropdownContainer.createEl("input", {
			type: "text",
			placeholder: "Search icons...",
			cls: "icon-search-input",
		});

		// Create icons container
		const iconsContainer = dropdownContainer.createEl("div", {
			cls: "icons-container",
		});

		// Function to render icons
		const renderIcons = (searchTerm = "") => {
			iconsContainer.empty();
			const allIcons = getIconIds();
			const filteredIcons = searchTerm ? allIcons.filter((id) => id.toLowerCase().includes(searchTerm.toLowerCase())) : allIcons;

			filteredIcons.forEach((iconId) => {
				const iconWrapper = iconsContainer.createEl("div", {
					cls: "icon-wrapper",
					attr: { title: iconId },
				});

				const iconContainer = iconWrapper.createEl("span", {
					cls: "icon-container",
				});
				setIcon(iconContainer, iconId);

				iconWrapper.addEventListener("click", async () => {
					if (await updateIcon(iconConfig.id, iconId)) {
						setIcon(currentIconContainer, iconId);
						dropdownContainer.classList.remove("is-visible");
						new Notice(`Icon updated successfully`);
					}
				});
			});
		};

		// Handle search input
		searchInput.addEventListener("input", (e) => {
			const target = e.target as HTMLInputElement;
			renderIcons(target.value);
		});

		// Toggle dropdown on button click
		iconButton.addEventListener("click", (e) => {
			e.stopPropagation();
			const isVisible = dropdownContainer.classList.contains("is-visible");
			if (!isVisible) {
				renderIcons();
				dropdownContainer.classList.add("is-visible");
				searchInput.focus();
			} else {
				dropdownContainer.classList.remove("is-visible");
			}
		});

		// Close dropdown when clicking outside
		document.addEventListener("click", (e) => {
			if (!iconButton.contains(e.target as Node) && !dropdownContainer.contains(e.target as Node)) {
				dropdownContainer.classList.remove("is-visible");
			}
		});
	}

	private addDeleteButton(iconSetting: Setting, removeIcon: (id: string) => Promise<void>, iconConfig: any) {
		iconSetting.addButton((button) => {
			button
				.setButtonText("Delete")
				.setClass("mod-warning")
				.onClick(async () => {
					await removeIcon(iconConfig.id);
					this.display();
				});
		});
	}
}
