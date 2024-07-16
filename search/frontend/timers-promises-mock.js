export const setTimeout = (fn, ms) => new Promise(resolve => setTimeout(() => {
    fn();
    resolve();
}, ms));

export const setImmediate = (fn) => new Promise(resolve => setImmediate(() => {
    fn();
    resolve();
}));

export const clearTimeout = (id) => clearTimeout(id);
export const clearImmediate = (id) => clearImmediate(id);
