# Website Icons

This folder contains all the icons used throughout the BODAX Gaming website.

## Folder Structure

```
public/icons/
├── social/          # Social media icons
├── navigation/      # Navigation and UI icons
├── gaming/          # Gaming-related icons
├── team/            # Team member and role icons
├── logos/           # Official BODAX Gaming and BODAX.dev logos
└── misc/            # Miscellaneous icons
```

## Usage

Icons in this folder can be referenced in your React components using:

```jsx
// For SVG icons
<img src="/icons/social/twitter.svg" alt="Twitter" />

// For PNG/JPG icons
<img src="/icons/social/discord.png" alt="Discord" />

// In CSS
background-image: url('/icons/navigation/arrow.svg');
```

## Icon Guidelines

- **Format**: Prefer SVG for scalable icons, PNG for complex graphics
- **Size**: Provide multiple sizes (16px, 24px, 32px, 48px) when needed
- **Naming**: Use descriptive, lowercase names with hyphens (e.g., `twitter-icon.svg`)
- **Optimization**: Optimize SVG files and compress PNG/JPG files
- **Accessibility**: Always include proper alt text for images

## Current Icons

### Social Media
- Twitter icon
- Twitch icon  
- Discord icon
- Instagram icon
- YouTube icon

### Navigation
- Hamburger menu icon
- Close/X icon
- Arrow icons

### Gaming
- Game controller icons
- Tournament icons
- Team icons

### Logos
- BODAX Gaming logo
- BODAX.dev logo

## Adding New Icons

1. Place the icon file in the appropriate subfolder
2. Use descriptive naming convention
3. Optimize the file size
4. Update this README with the new icon information
