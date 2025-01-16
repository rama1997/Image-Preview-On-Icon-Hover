import { App, Setting, setIcon, getIconIds, Notice, PluginSettingTab } from "obsidian";
import ImagePreviewOnIconHoverPlugin from "./main";
import { ImageFileSuggester } from "./imageFileSuggester";

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
		new Setting(this.containerEl)
			.setName("Left sidebar toggle icon")
			.setDesc("Assign an image to display when hovering over the left sidebar toggle icon")
			.addSearch((text) => {
				new ImageFileSuggester(this.app, text.inputEl);
				text
					.setPlaceholder("images/example.png")
					.setValue(this.plugin.settings.CoreButtonsImage.leftSidebarToggleImagePath)
					.onChange(async (value) => {
						await this.plugin.updateLeftSidebarToggleImagePath(value);
					});
			});
	}

	private setupRightSidebarToggleSetting() {
		new Setting(this.containerEl)
			.setName("Right sidebar toggle icon")
			.setDesc("Assign an image to display when hovering over the righ sidebar toggle icon")
			.addSearch((text) => {
				new ImageFileSuggester(this.app, text.inputEl);
				text
					.setPlaceholder("images/example.png")
					.setValue(this.plugin.settings.CoreButtonsImage.rightSidebarToggleImagePath)
					.onChange(async (value) => {
						await this.plugin.updateRightSidebarToggleImagePath(value);
					});
			});
	}

	private setupVaultSwitcherSetting() {
		new Setting(this.containerEl)
			.setName("Vault switcher")
			.setDesc("Assign an image to display when hovering over the vault switcher")
			.addSearch((text) => {
				new ImageFileSuggester(this.app, text.inputEl);
				text
					.setPlaceholder("images/example.png")
					.setValue(this.plugin.settings.CoreButtonsImage.vaultSwitcherImagePath)
					.onChange(async (value) => {
						await this.plugin.updateVaultSwitcherImagePath(value);
					});
			});
	}

	private setupHelpIconSetting() {
		new Setting(this.containerEl)
			.setName("Help icon")
			.setDesc("Assign an image to display when hovering over the help icon")
			.addSearch((text) => {
				new ImageFileSuggester(this.app, text.inputEl);
				text
					.setPlaceholder("images/example.png")
					.setValue(this.plugin.settings.CoreButtonsImage.helpIconImagePath)
					.onChange(async (value) => {
						await this.plugin.updateHelpIconImagePath(value);
					});
			});
	}

	private setupSettingIconSetting() {
		new Setting(this.containerEl)
			.setName("Setting icon")
			.setDesc("Assign an image to display when hovering over the setting icon")
			.addSearch((text) => {
				new ImageFileSuggester(this.app, text.inputEl);
				text
					.setPlaceholder("images/example.png")
					.setValue(this.plugin.settings.CoreButtonsImage.settingIconImagePath)
					.onChange(async (value) => {
						await this.plugin.updateSettingIconImagePath(value);
					});
			});
	}

	private setupRibbonIconSetting() {
		this.containerEl.createEl("h2", { text: "Ribbon bar icons" });

		// Add button to add new Ribbon Bar icon
		new Setting(this.containerEl).setName(`Add new ribbon bar icon`).addButton((button) => {
			button.setButtonText("+").onClick(async () => {
				await this.plugin.addNewRibbonIcon();
				this.display();
			});
		});

		// Display settings for each icon
		this.plugin.settings.RibbonBarIcons.forEach((iconConfig) => {
			const iconSetting = new Setting(this.containerEl)
				.setName(`Ribbon bar icon`)
				.setDesc("Assign an image to display when hovering the ribbon icon")
				.addSearch((text) => {
					new ImageFileSuggester(this.app, text.inputEl);
					text
						.setPlaceholder("images/example.png")
						.setValue(iconConfig.imagePath)
						.onChange(async (value) => {
							await this.plugin.updateRibbonIconImagePath(iconConfig.id, value);
						});
				});

			// Add icon picker button
			this.createIconPicker(iconSetting, (id, iconId) => this.plugin.updateRibbonIcon(id, iconId), iconConfig, "ribbonIcon");

			// Add delete button to icon setting
			iconSetting.addButton((button) => {
				button
					.setButtonText("Delete")
					.setClass("mod-warning")
					.onClick(async () => {
						await this.plugin.removeRibbonIcon(iconConfig.id);
						this.display();
					});
			});
		});
	}

	private setupStatusBarSetting() {
		this.containerEl.createEl("h2", { text: "Status bar icons" });

		// Add button to add new Status Bar icon
		new Setting(this.containerEl).setName(`Add new status bar icon`).addButton((button) => {
			button.setButtonText("+").onClick(async () => {
				await this.plugin.addNewStatusBarIcon();
				this.display();
			});
		});

		// Display settings for each icon
		this.plugin.settings.StatusBarIcons.forEach((iconConfig) => {
			const iconSetting = new Setting(this.containerEl)
				.setName(`Status bar icon`)
				.setDesc("Assign an image to display when hovering the status bar icon")
				.addSearch((text) => {
					new ImageFileSuggester(this.app, text.inputEl);
					text
						.setPlaceholder("images/example.png")
						.setValue(iconConfig.imagePath)
						.onChange(async (value) => {
							await this.plugin.updateStatusBarIconImagePath(iconConfig.id, value);
						});
				});

			// Add icon picker button
			this.createIconPicker(iconSetting, (id, iconId) => this.plugin.updateStatusBarIcon(id, iconId), iconConfig, "statusBarIcon");

			// Add delete button to icon setting
			iconSetting.addButton((button) => {
				button
					.setButtonText("Delete")
					.setClass("mod-warning")
					.onClick(async () => {
						await this.plugin.removeStatusBarIcon(iconConfig.id);
						this.display();
					});
			});
		});
	}

	private createIconPicker(iconSetting: Setting, updateIcon: (id: string, iconId: string) => Promise<boolean>, iconConfig: any, iconTypeKey: string) {
		// Add data attribute for styling
		iconSetting.controlEl.setAttribute("data-plugin", "image-preview-on-icon-hover");

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
}
