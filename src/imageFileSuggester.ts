import { App, TAbstractFile, TFile, AbstractInputSuggest } from "obsidian";

export class ImageFileSuggester extends AbstractInputSuggest<TFile> {
	private inputEl: HTMLInputElement;

	constructor(app: App, inputEl: HTMLInputElement) {
		super(app, inputEl);
		this.inputEl = inputEl;
	}

	getSuggestions(inputStr: string): TFile[] {
		const abstractFiles = this.app.vault.getAllLoadedFiles();
		const files: TFile[] = [];
		const inputLower = inputStr.toLowerCase();
		const viewRegistry = (this.app as any).viewRegistry;

		// Finds files that have "image" file extensions
		abstractFiles.forEach((file: TFile) => {
			if (viewRegistry.isExtensionRegistered(file.extension) && viewRegistry.getTypeByExtension(file.extension) === "image" && file.path.toLowerCase().contains(inputLower)) {
				files.push(file);
			}
		});

		return files;
	}

	renderSuggestion(file: TFile, el: HTMLElement): void {
		el.setText(file.path);
	}

	selectSuggestion(file: TFile): void {
		this.inputEl.value = file.path;
		this.inputEl.trigger("input");
		this.close();
	}
}
