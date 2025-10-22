# Player and Coach Photos

This directory contains the photos for Bodax Gaming team members.

## Directory Structure

```
photos/
├── players/
│   ├── nail.jpg
│   ├── simplex.jpg
│   ├── insanedin.jpg
│   ├── euii.jpg
│   └── reos.jpg
└── coaches/
    ├── cloudtail.jpg
    └── sharky.jpg
```

## Photo Requirements

- **Format**: JPG or PNG
- **Size**: Recommended 300x300px or larger (square aspect ratio works best)
- **File size**: Keep under 1MB for optimal loading
- **Quality**: High quality, professional photos

## How to Add Photos

1. **Upload your photos** to the appropriate folders:
   - Player photos go in `players/` folder
   - Coach photos go in `coaches/` folder

2. **Name the files exactly** as shown in the directory structure above

3. **Run the team update** in the Admin panel:
   - Go to Admin → Click "UPDATE TEAM ROSTER" button
   - This will update the database with the new photo paths

## Alternative: External URLs

If you prefer to use external image hosting (Imgur, Cloudinary, etc.):

1. Upload photos to your chosen service
2. Get the direct image URLs
3. Update the `photoUrl` fields in `src/seedData.js` with the URLs
4. Run the team update in Admin panel

## Current Photo Paths

The system is configured to look for photos at these paths:
- Players: `/photos/players/[name].jpg`
- Coaches: `/photos/coaches/[name].jpg`

Make sure your uploaded files match these exact names!
