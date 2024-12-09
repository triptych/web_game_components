# Web Game Components

A collection of reusable web components specifically designed for building game user interfaces. These components are built using native Web Components technology, making them framework-agnostic and easy to integrate into any web game project.

## Features

- 🎮 Game-specific UI components
- 🎨 Pixel art aesthetics
- 🔊 Built-in sound effects
- 📱 Responsive design
- 🎯 Framework-agnostic
- 🔌 Easy to integrate

## Components

### Game Button
A stylized button component with pixel art aesthetics and sound effects. Features multiple themes and sizes.

```html
<game-button text="Start Game" theme="primary" size="large"></game-button>
```

Attributes:
- `text`: Button text content
- `theme`: primary (default) | success | danger
- `size`: small | medium (default) | large

### Game Sprite
A sprite component for displaying game graphics with animation support. Features frame-by-frame animation, pixel-perfect rendering, and horizontal flipping.

```html
<game-sprite src="character.png" frame-width="32" frame-height="32" frame-count="8" fps="12"></game-sprite>
```

Attributes:
- `src`: URL of the sprite sheet image
- `frame-width`: Width of each frame in pixels (default: 32)
- `frame-height`: Height of each frame in pixels (default: 32)
- `frame-count`: Total number of frames in the sprite sheet (default: 1)
- `fps`: Frames per second for animation, set to 0 for static display (default: 0)
- `current-frame`: Current frame to display, 0-based index (default: 0)
- `flip`: Flip the sprite horizontally - 'none' or 'horizontal' (default: none)

## Installation

1. Clone the repository
2. Include the components you need in your project
3. Use them in your HTML

```html
<script type="module" src="path/to/components/ui/game-button.js"></script>
```

## Usage

Components can be used directly in HTML or created dynamically in JavaScript:

```html
<!-- HTML -->
<game-button text="Play Now" theme="success" size="large"></game-button>

<!-- JavaScript -->
<script>
const button = document.createElement('game-button');
button.setAttribute('text', 'Play Now');
button.setAttribute('theme', 'success');
button.setAttribute('size', 'large');
document.body.appendChild(button);
</script>
```

## Browser Support

Works in all modern browsers that support Web Components:
- Chrome
- Firefox
- Safari
- Edge

## License

MIT License - see LICENSE file for details
