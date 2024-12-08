// Game Sprite Component
export class GameSprite extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._frame = 0;
        this._animationFrame = null;
        this._lastFrameTime = 0;
        this.render();
    }

    static get observedAttributes() {
        return ['src', 'frame-width', 'frame-height', 'frame-count', 'fps', 'current-frame', 'flip'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'fps' && this.isAnimating) {
                this.stopAnimation();
                this.startAnimation();
            } else {
                this.render();
            }
        }
    }

    connectedCallback() {
        if (this.fps > 0) {
            this.startAnimation();
        }
    }

    disconnectedCallback() {
        this.stopAnimation();
    }

    get src() {
        return this.getAttribute('src') || '';
    }

    get frameWidth() {
        return parseInt(this.getAttribute('frame-width')) || 32;
    }

    get frameHeight() {
        return parseInt(this.getAttribute('frame-height')) || 32;
    }

    get frameCount() {
        return parseInt(this.getAttribute('frame-count')) || 1;
    }

    get fps() {
        return parseInt(this.getAttribute('fps')) || 0;
    }

    get currentFrame() {
        return parseInt(this.getAttribute('current-frame')) || 0;
    }

    get flip() {
        return this.getAttribute('flip') || 'none';
    }

    set currentFrame(value) {
        this.setAttribute('current-frame', value);
    }

    get isAnimating() {
        return this._animationFrame !== null;
    }

    startAnimation() {
        if (this.fps <= 0) return;

        const animate = (timestamp) => {
            if (!this._lastFrameTime) this._lastFrameTime = timestamp;

            const elapsed = timestamp - this._lastFrameTime;
            const frameTime = 1000 / this.fps;

            if (elapsed >= frameTime) {
                this._frame = (this._frame + 1) % this.frameCount;
                this.currentFrame = this._frame;
                this._lastFrameTime = timestamp;
            }

            this._animationFrame = requestAnimationFrame(animate);
        };

        this._animationFrame = requestAnimationFrame(animate);
    }

    stopAnimation() {
        if (this._animationFrame) {
            cancelAnimationFrame(this._animationFrame);
            this._animationFrame = null;
            this._lastFrameTime = 0;
        }
    }

    render() {
        const styles = `
            :host {
                display: inline-block;
                width: ${this.frameWidth}px;
                height: ${this.frameHeight}px;
                overflow: hidden;
            }

            .sprite {
                width: ${this.frameWidth}px;
                height: ${this.frameHeight}px;
                background-image: url(${this.src});
                background-repeat: no-repeat;
                background-position: -${this.currentFrame * this.frameWidth}px 0;
                image-rendering: pixelated;
                transform: scaleX(${this.flip === 'horizontal' ? -1 : 1});
            }
        `;

        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            <div class="sprite"></div>
        `;
    }
}

// Register the custom element
customElements.define('game-sprite', GameSprite);

// Export metadata for the component browser
export const metadata = {
    name: 'Game Sprite',
    category: 'ui',
    description: 'A sprite component for displaying game graphics with animation support',
    attributes: [
        {
            name: 'src',
            type: 'string',
            description: 'URL of the sprite sheet image'
        },
        {
            name: 'frame-width',
            type: 'number',
            default: '32',
            description: 'Width of each frame in pixels'
        },
        {
            name: 'frame-height',
            type: 'number',
            default: '32',
            description: 'Height of each frame in pixels'
        },
        {
            name: 'frame-count',
            type: 'number',
            default: '1',
            description: 'Total number of frames in the sprite sheet'
        },
        {
            name: 'fps',
            type: 'number',
            default: '0',
            description: 'Frames per second for animation (0 for static)'
        },
        {
            name: 'current-frame',
            type: 'number',
            default: '0',
            description: 'Current frame to display (0-based index)'
        },
        {
            name: 'flip',
            type: 'string',
            default: 'none',
            options: ['none', 'horizontal'],
            description: 'Flip the sprite horizontally'
        }
    ],
    examples: [
        {
            name: 'Static Sprite',
            code: '<game-sprite src="character.png" frame-width="32" frame-height="32"></game-sprite>'
        },
        {
            name: 'Animated Sprite',
            code: '<game-sprite src="walk-cycle.png" frame-width="32" frame-height="32" frame-count="8" fps="12"></game-sprite>'
        },
        {
            name: 'Flipped Sprite',
            code: '<game-sprite src="character.png" frame-width="32" frame-height="32" flip="horizontal"></game-sprite>'
        }
    ]
};
