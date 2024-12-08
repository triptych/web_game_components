// Component Browser Main Module

// State management
const state = {
    activeComponent: null,
    components: {
        ui: [],
        sprites: [],
        physics: [],
        effects: []
    }
};

// DOM Elements
const elements = {
    search: document.getElementById('componentSearch'),
    preview: document.getElementById('componentPreview'),
    previewTitle: document.getElementById('previewTitle'),
    previewControls: document.getElementById('previewControls'),
    sourceCode: document.getElementById('sourceCode'),
    categoryLists: {
        ui: document.getElementById('uiComponents'),
        sprites: document.getElementById('spriteComponents'),
        physics: document.getElementById('physicsComponents'),
        effects: document.getElementById('effectComponents')
    }
};

// Component Registry
const componentRegistry = {
    async registerComponent(category, componentModule) {
        const { metadata } = componentModule;
        state.components[category].push({
            ...metadata,
            module: componentModule
        });
        await updateComponentList(category);
    },

    getComponent(category, name) {
        return state.components[category].find(comp => comp.name === name);
    }
};

// UI Updates
const updateComponentList = async (category) => {
    const list = elements.categoryLists[category];
    if (!list) return;

    list.innerHTML = state.components[category]
        .map(comp => `
            <li data-category="${category}"
                data-component="${comp.name}"
                class="component-item ${state.activeComponent === comp.name ? 'active' : ''}">
                ${comp.name}
            </li>
        `)
        .join('');

    attachComponentListeners(list);
};

const updateUsageExample = (preview) => {
    const tagName = preview.tagName.toLowerCase();
    let attributes = '';

    // Get all attributes from the preview component
    Array.from(preview.attributes)
        .filter(attr => attr.name !== 'data-preview-component')
        .forEach(attr => {
            attributes += ` ${attr.name}="${attr.value}"`;
        });

    // Update the source code example
    const sourceCodeExample = `<${tagName}${attributes}></${tagName}>`;
    elements.sourceCode.innerHTML = `
        <div class="source-code-container">
            <h3>Usage Example</h3>
            <pre><code>${sourceCodeExample}</code></pre>
        </div>
    `;
};

const createAttributeControls = (component) => {
    const controls = document.createElement('div');
    controls.className = 'component-controls';

    if (!component.attributes) return controls;

    const controlsHtml = component.attributes.map(attr => `
        <div class="control-group">
            <label>${attr.name}</label>
            ${attr.options ? `
                <select data-attr="${attr.name}">
                    ${attr.options.map(option => `
                        <option value="${option}" ${option === attr.default ? 'selected' : ''}>
                            ${option}
                        </option>
                    `).join('')}
                </select>
            ` : `
                <input type="${attr.type === 'number' ? 'number' : 'text'}"
                       value="${attr.default}"
                       data-attr="${attr.name}">
            `}
            <small class="attr-description">${attr.description}</small>
        </div>
    `).join('');

    controls.innerHTML = controlsHtml;

    // Add event listeners
    controls.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('change', () => {
            const preview = document.querySelector(`[data-preview-component]`);
            if (preview) {
                preview.setAttribute(input.dataset.attr, input.value);
                // Update the usage example when attributes change
                updateUsageExample(preview);
            }
        });
    });

    return controls;
};

const createExamplePreview = (exampleCode) => {
    // Parse the example code to extract tag name and attributes
    const parser = new DOMParser();
    const doc = parser.parseFromString(exampleCode, 'text/html');
    const element = doc.body.firstChild;

    if (!element) return null;

    // Create a new element with the same tag name
    const preview = document.createElement(element.tagName.toLowerCase());

    // Copy all attributes
    Array.from(element.attributes).forEach(attr => {
        preview.setAttribute(attr.name, attr.value);
    });

    return preview;
};

const updatePreview = async (component) => {
    if (!component) {
        elements.preview.innerHTML = '<p class="placeholder-text">Select a component from the list to preview</p>';
        elements.previewTitle.textContent = 'Select a Component';
        elements.previewControls.innerHTML = '';
        elements.sourceCode.innerHTML = '';
        return;
    }

    elements.previewTitle.textContent = component.name;

    try {
        // Clear previous content
        elements.preview.innerHTML = '';
        elements.previewControls.innerHTML = '';

        // Create component description if available
        if (component.description) {
            const descriptionEl = document.createElement('div');
            descriptionEl.className = 'component-description';
            descriptionEl.innerHTML = `<p>${component.description}</p>`;
            elements.preview.appendChild(descriptionEl);
        }

        // Create component preview
        const previewWrapper = document.createElement('div');
        previewWrapper.className = 'component-preview';
        const componentInstance = document.createElement(component.module.GameButton.name.toLowerCase());
        componentInstance.setAttribute('data-preview-component', '');

        // Set default attributes
        if (component.attributes) {
            component.attributes.forEach(attr => {
                componentInstance.setAttribute(attr.name, attr.default);
            });
        }

        previewWrapper.appendChild(componentInstance);
        elements.preview.appendChild(previewWrapper);

        // Add controls to the preview controls section
        const controls = createAttributeControls(component);
        elements.previewControls.appendChild(controls);

        // Initialize usage example with default attributes
        updateUsageExample(componentInstance);

        // Display examples if available
        if (component.examples && component.examples.length > 0) {
            const examplesContainer = document.createElement('div');
            examplesContainer.className = 'examples-container';
            examplesContainer.innerHTML = '<h3>Examples</h3>';

            // Create and append each example
            component.examples.forEach(example => {
                const exampleDiv = document.createElement('div');
                exampleDiv.className = 'example';

                // Add example name and code
                const exampleHeader = document.createElement('h4');
                exampleHeader.textContent = example.name;
                exampleDiv.appendChild(exampleHeader);

                const codeBlock = document.createElement('pre');
                const code = document.createElement('code');
                code.textContent = example.code;
                codeBlock.appendChild(code);
                exampleDiv.appendChild(codeBlock);

                // Create preview container
                const previewDiv = document.createElement('div');
                previewDiv.className = 'example-preview';

                // Create and append the example preview
                const previewElement = createExamplePreview(example.code);
                if (previewElement) {
                    previewDiv.appendChild(previewElement);
                }

                exampleDiv.appendChild(previewDiv);
                examplesContainer.appendChild(exampleDiv);
            });

            elements.preview.appendChild(examplesContainer);
        }
    } catch (error) {
        console.error('Error loading component:', error);
        elements.preview.innerHTML = `
            <p class="error-message">
                Error loading component: ${error.message}
            </p>
        `;
    }
};

// Event Handlers
const handleComponentClick = async (event) => {
    const componentItem = event.target.closest('.component-item');
    if (!componentItem) return;

    const category = componentItem.dataset.category;
    const componentName = componentItem.dataset.component;

    // Update active state
    document.querySelectorAll('.component-item').forEach(item => {
        item.classList.remove('active');
    });
    componentItem.classList.add('active');

    // Update preview
    const component = componentRegistry.getComponent(category, componentName);
    state.activeComponent = componentName;
    await updatePreview(component);
};

const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();

    Object.keys(state.components).forEach(category => {
        const items = elements.categoryLists[category].querySelectorAll('.component-item');

        items.forEach(item => {
            const componentName = item.dataset.component.toLowerCase();
            item.style.display = componentName.includes(searchTerm) ? 'block' : 'none';
        });
    });
};

// Event Listeners
const attachComponentListeners = (list) => {
    list.addEventListener('click', handleComponentClick);
};

const initializeEventListeners = () => {
    elements.search.addEventListener('input', handleSearch);
};

// Load Components
const loadComponents = async () => {
    try {
        // Import game-button component using relative path
        const gameButtonModule = await import('../../components/ui/game-button.js');
        await componentRegistry.registerComponent('ui', gameButtonModule);
    } catch (error) {
        console.error('Error loading components:', error);
    }
};

// Initialization
const initialize = async () => {
    initializeEventListeners();
    await loadComponents();
};

// Start the application
document.addEventListener('DOMContentLoaded', initialize);

// Export for external use
export { componentRegistry, state };
