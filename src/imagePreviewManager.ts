import { App } from "obsidian";

export class ImagePreviewManager {
	private app: App;
	private popupElement: HTMLDivElement | null = null;
	private popupImage: HTMLImageElement | null = null;

	constructor(app: App) {
		this.app = app;
	}

	setupImagePopup(): void {
		if (!this.popupElement) {
			// Create hover element container
			this.popupElement = document.createElement("div");
			this.popupElement.className = "image-hover-preview";

			// Create image element
			this.popupImage = document.createElement("img");
			this.popupImage.className = "hover-image";

			// Append image to container
			this.popupElement.appendChild(this.popupImage);

			// Add to document body
			document.body.appendChild(this.popupElement);
		}
	}

	showImage(imagePath: string): boolean {
		if (!this.popupElement || !this.popupImage) {
			return false;
		}

		const { vault } = this.app;
		const imageFile = vault.getFileByPath(imagePath);

		if (imageFile) {
			// Get resource path for the image
			const resourcePath = this.app.vault.adapter.getResourcePath(imagePath);

			// Set image source and make hover element visible
			this.popupImage.src = resourcePath;
			this.popupElement.classList.add("visible");

			return true;
		}

		return false;
	}

	hideImage(): void {
		this.popupElement?.classList.remove("visible");
	}

	cleanup(): void {
		this.popupElement?.remove();
		this.popupElement = null;
		this.popupImage = null;
	}
}
