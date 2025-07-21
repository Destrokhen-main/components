import {useCallback, useEffect} from 'react';

export function withCtrl(key: string) {
    return (event: KeyboardEvent) => {
        return (event.ctrlKey || event.metaKey) && event.key === key;
    };
}

type KeyShortcut = ((event: KeyboardEvent) => boolean) | string;

export function useShortcuts(keys: KeyShortcut[], callback: (event: KeyboardEvent) => void) {
    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            if (
                keys.some((key) => {
                    return typeof key === 'string' ? event.key === key : key(event);
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
