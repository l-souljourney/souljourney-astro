import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { hasDuplicateFrontmatterAtBodyStart } from "./contentIntegrity";

const isMarkdownFile = (file: string): boolean => file.endsWith(".md") || file.endsWith(".mdx");

const walkMarkdownFiles = (baseDir: string): string[] => {
	const result: string[] = [];
	const walk = (dir: string): void => {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				walk(fullPath);
			} else if (entry.isFile() && isMarkdownFile(entry.name)) {
				result.push(fullPath);
			}
		}
	};
	walk(baseDir);
	return result;
};

export const validateMarkdownIntegrityInDir = (baseDir: string): void => {
	const files = walkMarkdownFiles(baseDir);
	const violations: string[] = [];
	for (const filePath of files) {
		const raw = readFileSync(filePath, "utf-8");
		if (hasDuplicateFrontmatterAtBodyStart(raw)) {
			violations.push(filePath);
		}
	}
	if (violations.length > 0) {
		throw new Error(
			`[content-integrity] duplicated frontmatter detected in ${violations.length} file(s):\n${violations.join("\n")}`
		);
	}
};
