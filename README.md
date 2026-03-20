# AsWingTS

TypeScript reimplementation of [AsWing](http://www.aswing.org) - A UI framework similar to Java Swing for Flash/ActionScript.

**Repository:** https://github.com/dreamsxin/AsWingTS

## Overview

AsWingTS brings the classic Swing-style UI component framework to modern TypeScript/JavaScript environments using DOM rendering. It provides:

- Component-based UI architecture
- Layout managers (BorderLayout, BoxLayout, FlowLayout, etc.)
- Event system (standard DOM events)
- CSS-based styling
- Common UI components (Button, Label, Panel, Frame, etc.)

## Status

**Phase 1 Complete** ✅ - Core foundation implemented:
- Component/Container base classes
- Geometry classes (IntDimension, IntPoint, IntRectangle)
- Event system
- BorderLayout manager
- Basic components (JButton, JLabel, JPanel, JFrame)

See [PROJECT_STATUS.md](PROJECT_STATUS.md) for detailed progress and roadmap.

## Project Structure

```
AsWingTS/
├── src/
│   └── org/
│       └── aswing/
│           ├── Component.ts       # Base component class
│           ├── Container.ts       # Container for components
│           ├── AsWingManager.ts   # Framework manager
│           ├── event/             # Event classes
│           ├── geom/              # Geometry classes (IntDimension, IntPoint, etc.)
│           ├── border/            # Border implementations
│           ├── plaf/              # Pluggable Look & Feel
│           └── ...
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

```bash
npm install
npm run build
```

## Usage Example

```typescript
import { JFrame, JButton, JLabel, BorderLayout, AsWingConstants } from 'aswing-ts';

const frame = new JFrame('My Application');
frame.setSize(400, 300);

// Add components to content pane
const label = new JLabel('Hello, World!');
frame.getContentPane().add(label, AsWingConstants.CENTER);

const button = new JButton('Click Me');
button.addEventListener('act', () => {
  label.setText('Clicked!');
});
frame.getContentPane().add(button, AsWingConstants.SOUTH);

// Add frame to DOM
document.getElementById('app').appendChild(frame.getElement());
```

## Examples

Open `examples/index.html` in your browser to see all demos:

- **Basic Example** - JFrame, JButton, JLabel with BorderLayout
- **Components Demo** - Interactive buttons, nested panels, label alignments
- **Layout Showcase** - Complete dashboard UI with sidebar navigation

Or run a local server:

```bash
npx http-server -p 8080
# Open: http://localhost:8080/examples/index.html
```

## License

MIT License - see LICENSE file for details

## Links

- **GitHub:** https://github.com/dreamsxin/AsWingTS
- **Original AsWing:** http://www.aswing.org
