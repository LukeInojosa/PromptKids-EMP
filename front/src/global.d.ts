// Adiciona declaração para tmImage no objeto window para TypeScript
/**
 * @typedef {typeof import("teachablemachine-image")} tmImage
 */

/**
 * Extende a interface Window para incluir tmImage.
 * Isso é necessário para evitar erros de TypeScript.
 */
/* eslint-disable no-unused-vars */
declare global {
    interface Window {
        tmImage: any;
    }
}
/* eslint-enable no-unused-vars */