import {useCallback, useEffect} from 'react';

export function withCtrl(key: KeyShortcut) {
    return (event: KeyboardEvent) => {
        if (event.ctrlKey || event.metaKey) {
            return typeof key === 'function' ? key(event) : event.key === key;
        }
        return false;
    };
}

export function withAlt(key: KeyShortcut) {
    return (event: KeyboardEvent) => {
        if (event.altKey) {
            return typeof key === 'function' ? key(event) : event.key === key;
        }
        return false;
    };
}

type KeyShortcut = ((event: KeyboardEvent) => boolean) | string;

export function useShortcuts(keys: KeyShortcut[], callback: (event: KeyboardEvent) => void) {
    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            if (
                keys.some((key) => {
                    return typeof key === 'function' ? key(event) : event.key === key;
                })
            ) {
                callback(event);
            }
        },
        [keys, callback],
    );

    useEffect(() => {
        const targetNode = document;
        if (targetNode) {
            targetNode.addEventListener('keydown', handleKeyPress);
        }

        return () => {
            if (targetNode) {
                targetNode.removeEventListener('keydown', handleKeyPress);
            }
        };
    }, [handleKeyPress]);
}
