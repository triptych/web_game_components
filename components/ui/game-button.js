// Game Button Component
export class GameButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    static get observedAttributes() {
        return ['text', 'theme', 'size'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    get text() {
        return this.getAttribute('text') || 'Click Me';
    }

    get theme() {
        return this.getAttribute('theme') || 'primary';
    }

    get size() {
        return this.getAttribute('size') || 'medium';
    }

    render() {
        const styles = `
            :host {
                display: inline-block;
            }

            .game-button {
                font-family: 'Press Start 2P', system-ui, sans-serif;
                border: none;
                border-radius: 4px;
                padding: 0;
                cursor: pointer;
                position: relative;
                transition: transform 0.1s ease-in-out;
                user-select: none;
            }

            .game-button:active {
                transform: translateY(2px);
            }

            /* Themes */
            .theme-primary {
                --button-color: #4a90e2;
                --button-hover: #357abd;
                --button-active: #2b62a3;
                --button-shadow: #2b62a3;
            }

            .theme-success {
                --button-color: #2ecc71;
                --button-hover: #27ae60;
                --button-active: #219a52;
                --button-shadow: #219a52;
            }

            .theme-danger {
                --button-color: #e74c3c;
                --button-hover: #c0392b;
                --button-active: #a93224;
                --button-shadow: #a93224;
            }

            /* Sizes */
            .size-small {
                --button-padding: 8px 16px;
                --button-font-size: 12px;
            }

            .size-medium {
                --button-padding: 12px 24px;
                --button-font-size: 14px;
            }

            .size-large {
                --button-padding: 16px 32px;
                --button-font-size: 16px;
            }

            /* Button Styles */
            .game-button {
                background-color: var(--button-color);
                color: white;
                padding: var(--button-padding);
                font-size: var(--button-font-size);
                box-shadow: 0 4px 0 var(--button-shadow);
            }

            .game-button:hover {
                background-color: var(--button-hover);
            }

            .game-button:active {
                background-color: var(--button-active);
                box-shadow: 0 2px 0 var(--button-shadow);
            }

            /* Pixel Art Border */
            .game-button::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 6px;
                pointer-events: none;
            }
        `;

        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            <button class="game-button theme-${this.theme} size-${this.size}">
                ${this.text}
            </button>
        `;

        // Add click sound effect
        this.shadowRoot.querySelector('button').addEventListener('click', () => {
            const audio = new Audio('data:audio/wav;base64,UklGRnQGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YU8GAACBhYqFbF1fdH+Df4F/gn+Df4N/hICFgYaBhYKGgoaBhoCFgIV/hX+Ff4R/hH+Df4J/gn+Bf4F/gH9/f39/f39/f39/gH+Af4F/gn+Df4R/hX+Gf4d/iH+Jf4p/i3+Mf41/jn+Pf5B/kX+Sf5N/lH+Vf5Z/l3+Yf5l/mn+bf5x/nX+ef59/oH+hf6J/o3+kf6V/pn+nf6h/qX+qf6t/rH+tf65/r3+wf7F/sn+zf7R/tX+2f7d/uH+5f7p/u3+8f71/vn+/f8B/wX/Cf8N/xH/Ff8Z/x3/If8l/yn/Lf8x/zX/Of89/0H/Rf9J/03/Uf9V/1n/Xf9h/2X/af9t/3H/df95/33/gf+F/4n/jf+R/5X/mf+d/6H/pf+p/63/sf+1/73/wf/F/83/0f/R/+H/4f/x//H8EPwR/FH8UfyR/JH80fzR/RH9Ef1R/VH9kf2R/dH90f4R/hH+Uf5R/pH+kf7R/tH/Ef8R/1H/Uf+R/5H/0f/R/BIAEgBSAFIAkgCSANIA0gESARIBUgFSAZIBkgHSAdICEgISAlICUgKSApIDUgNSA5IDkgPSA9IEEgQSBFIEUgSSBJIE0gTSBRIFEgVSBVIFkgWSBdIF0gYSBhIGUgZSBpIGkgbSBtIHEgcSB1IHUgeSB5IH0gfSCBIIEghSCFIIkgiSCNII0gkSCRIJUglSCZIJkgnSCdIKEgoSClIKUgqSCpIK0grSCxILEgtSC1ILkguSC9IL0gwSDBIMUgxSDJIMkgzSDNINEg0SDVINUg2SDZIN0g3SDhIOEg5SDlIOkg6SDtIO0g8SDxIPUg9SD5IPkg/SD9IQEhASEFIQUhCSEJIQ0hDSERIREhFSEVIRkhGSEdIR0hISEhISUhJSEpISkhLSEtITEhMSE1ITUhOSE5IT0hPSFBIUEhRSFFIUkhSSFNIU0hUSFRIVUhVSFZIVkhXSFdIWEhYSFlIWUhaSFpIW0hbSFxIXEhdSF1IXkheSF9IX0hgSGBIYUhhSGJIYkhjSGNIZEhkSGVIZUhmSGZIZ0hnSGhIaEhpSGlIakhqSGtIa0hsSGxIbUhtSG5IbkhvSG9IcEhwSHFIcUhySHJIc0hzSHRIdEh1SHVIdkh2SHdId0h4SHhIeUh5SHpIekh7SHtIfEh8SH1IfUh+SH5If0h/SIBIgEiBSIFIgkiCSINIg0iESIRIhUiFSIZIhkiHSIdIiEiISIlIiUiKSIpIi0iLSIxIjEiNSI1IjkiOSI9Ij0iQSJBIkUiRSJJIkkiTSJNIlEiUSJVIlUiWSJZIl0iXSJhImEiZSJlImkiaSJtIm0icSJxInUidSJ5InkifSJ9IoEigSKFIoUiiSKJIo0ijSKRIpEilSKVIpkimSKdIp0ioSKhIqUipSKpIqkirSKtIrEisSK1IrUiuSK5Ir0ivSLBIsEixSLFIskiySLNIs0i0SLRItUi1SLZItkj9Sv1KBk0GTQ9PD08YURhRIVMhUypVKlUzVzNXPFk8WUVbRVtOXU5dV19XX2BhYGFpY2ljcmVyZXtne2eEaYRpjGuMa5VtlW2ecJ5wp3Kncrp0unTDdsN2zHjMeNV61XrefeF95n/mf/GB8YH6g/qD');
            audio.volume = 0.2;
            audio.play().catch(() => {}); // Ignore autoplay restrictions
        });
    }
}

// Register the custom element
customElements.define('game-button', GameButton);

// Export metadata for the component browser
export const metadata = {
    name: 'Game Button',
    category: 'ui',
    description: 'A stylized button component with pixel art aesthetics and sound effects',
    attributes: [
        {
            name: 'text',
            type: 'string',
            default: 'Click Me',
            description: 'The text to display on the button'
        },
        {
            name: 'theme',
            type: 'string',
            default: 'primary',
            options: ['primary', 'success', 'danger'],
            description: 'The color theme of the button'
        },
        {
            name: 'size',
            type: 'string',
            default: 'medium',
            options: ['small', 'medium', 'large'],
            description: 'The size of the button'
        }
    ],
    examples: [
        {
            name: 'Default Button',
            code: '<game-button text="Click Me"></game-button>'
        },
        {
            name: 'Success Button',
            code: '<game-button text="Level Complete" theme="success" size="large"></game-button>'
        },
        {
            name: 'Danger Button',
            code: '<game-button text="Game Over" theme="danger" size="small"></game-button>'
        }
    ]
};
