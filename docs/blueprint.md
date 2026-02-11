# **App Name**: Bar Buddy Access

## Core Features:

- QR Code Scanning: Scan QR codes to identify guests and automatically check them in if they are not blacklisted.
- Guest Database: Maintain a database of guests with information such as name, photo, phone number, description, and blacklist status using Firestore.
- Blacklist Alert: Display a full-screen alert if a blacklisted guest is scanned, preventing access.
- Attendance Logging: Automatically create attendance logs in Firestore when a guest is checked in, including the timestamp and the admin who allowed entry.
- Admin Interface: Provide an admin interface to search guests by name, filter by list/ticket type, and manage guest information and blacklist status.
- Photo Upload: Integrate with the tablet's camera to allow admins to take and upload photos of new guests to Firebase Storage.

## Style Guidelines:

- Primary color: A deep forest green (#228B22), drawing inspiration from the security and natural elements to create a grounding visual foundation.
- Background color: An even darker, muted green (#1A521A) to enhance the dark mode experience while aligning with the primary hue, set at a lower saturation to prevent eye strain in low light conditions.
- Accent color: A golden-yellow (#FFC300) to provide a stark contrast, used for call-to-action elements, embodying the energetic atmosphere of a bar while maintaining clarity and visibility.
- Headline font: 'Space Grotesk' (sans-serif) for a contemporary and computerized feel.
- Body font: 'Inter' (sans-serif) provides a modern, neutral look, complementing 'Space Grotesk' for longer text sections.
- Use minimalist icons that represent guest categories and access control functions, designed to be easily recognizable at a glance.
- Employ a clear and spacious layout with large, easily tappable buttons for quick operation. Prioritize key information on the guest cards for immediate assessment.
- Incorporate subtle animations for feedback on actions, such as a smooth transition for displaying guest details or a distinct animation for blacklist alerts to grab attention immediately.