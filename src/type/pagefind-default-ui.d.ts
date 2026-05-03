declare module '@pagefind/default-ui' {
  export interface PagefindUiOptions {
    element: string;
    bundlePath?: string | null;
    showImages?: boolean;
    [key: string]: unknown;
  }

  export class PagefindUI {
    constructor(options: PagefindUiOptions);
  }
}
