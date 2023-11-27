export declare function debounce<T extends (...args: any) => void>(callback: T, timeout?: number): (...args: Parameters<T>) => void;
