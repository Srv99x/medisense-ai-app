

# MediSense AI — Premium Symptom Analyzer Frontend

## Design Vision
A breathtaking dark-mode medical AI interface with bioluminescent aesthetics — cyan/teal/emerald glowing accents over deep slate-950 backgrounds. Full glassmorphism throughout with frosted glass panels, glowing borders, and buttery-smooth animations.

---

## Page Structure

### 1. Hero Section
- Large glowing gradient text title "MediSense AI" (cyan → teal → emerald gradient)
- Subtitle tagline: "Advanced Neural Symptom Analysis"
- Pulsing Activity icon with a medical waveform animation beneath the title
- Subtle floating particle/glow effects in the background

### 2. Symptom Input Area
- Oversized frosted-glass textarea (`bg-white/5`, `backdrop-blur-md`) with a glowing cyan border on focus
- Placeholder text guiding the user: "Describe your symptoms in detail..."
- Character count indicator

### 3. Submit Button — "Initialize AI Analysis"
- Gradient background (cyan → teal) with a soft glow/shadow effect
- On click: transforms to a loading state with a spinning icon and text "Processing Neural Data..."
- Disabled state while processing

### 4. Results Dashboard (conditionally rendered with animated entry)
- **Urgency Badge**: Pill-shaped neon badge — pulsating red for "High", green for "Low", amber for "Medium"
- **Possible Conditions Grid**: Glassmorphic floating cards in a responsive grid, each with condition name, probability indicator, and description. Subtle lift-on-hover effect
- **Care Protocols**: Stylized checklist with custom glowing checkmark icons for each recommendation
- Smooth fade-in + scale-in animation when results appear

### 5. Disclaimer Banner (always visible at bottom)
- Dark red glassmorphic banner with bright red text and ShieldAlert icon
- Text: "EDUCATIONAL TOOL ONLY. NOT A DOCTOR."
- Unmissable but elegantly styled to fit the premium aesthetic

## Technical Approach
- Single-page layout, no routing needed beyond the index
- Custom dark theme with cyan/teal/emerald CSS variables
- Dummy async fetch function pointing to `http://localhost:8000/api/analyze` with mock fallback data so the UI is fully demo-able
- React state management with useState for symptoms input, loading state, and results
- shadcn/ui components (Card, Badge, Button, Textarea) + Lucide icons (Activity, ShieldAlert, Pill, CheckCircle, Brain, AlertTriangle)
- Tailwind animations: fade-in, scale-in, pulse effects on urgency badges, hover transitions on cards

