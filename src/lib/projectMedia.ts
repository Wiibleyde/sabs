import type { Project, ProjectMedia } from "@/data/projects";

/** Extract the video id from any common YouTube URL shape. */
export function getYouTubeId(url: string): string | null {
	const m = url.match(
		/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/,
	);
	return m ? m[1] : null;
}

/** Thumbnail for a single media, or null when it has no visual (video/link). */
export function getMediaThumbnail(media: ProjectMedia): string | null {
	if (media.type === "youtube") {
		const id = getYouTubeId(media.url);
		return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
	}
	if (media.type === "image") return media.url;
	return null;
}

/** First usable thumbnail across a project's medias. */
export function getProjectThumbnail(p: Project): string | null {
	for (const m of p.medias) {
		const thumb = getMediaThumbnail(m);
		if (thumb) return thumb;
	}
	return null;
}

/** ISO date → long French date. Parsed by parts to stay timezone-agnostic. */
export function formatProjectDate(iso: string): string {
	const [y, m, d] = iso.split("-").map(Number);
	return new Date(y, m - 1, d).toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}
