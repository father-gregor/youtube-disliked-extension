export function Bind (target, name, descriptor) {
    return {
        get() {
            const bound = descriptor.value.bind(this);
            Object.defineProperty(this, name, {value: bound});
            return bound;
        }
    };
}
