// Simple TypeScript proof of concept
interface ButtonConfig {
  id: string;
  message: string;
}

const buttonConfig: ButtonConfig = {
  id: 'testButton',
  message: 'Button clicked!',
};

function initializeButton(config: ButtonConfig): void {
  const button = document.getElementById(config.id);
  if (button) {
    button.addEventListener('click', () => {
      alert(config.message);
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initializeButton(buttonConfig);
});
