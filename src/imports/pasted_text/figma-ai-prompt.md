This is the prompt I would give Figma AI. It's specific enough to generate a consistent multi-screen prototype while leaving room for refinement later.

---

# Figma AI Prompt

Create a **high-fidelity desktop web application prototype** for **Saarthi AI – Your Government Assistant**.

The prototype should recreate the entire **10-step mobile workflow** in a **desktop-first experience**, maintaining the same sequence of actions while redesigning the layout for a large screen.

This is **only a UI/UX prototype**. No backend or real functionality is required. All information can be hardcoded and pre-filled.

---

## Overall Design Style

* Clean government-tech interface
* Modern, trustworthy, accessible
* White background
* Soft green (#2E7D32) primary color
* Light gray cards
* Rounded corners (12–16px)
* Soft shadows
* Large icons
* Very little text
* Friendly illustrations
* Minimal clutter
* Designed for elderly users and first-time digital users

The design should feel like a mix of:

* UMANG
* DigiLocker
* Google Material Design
* Apple Human Interface

---

# Global Layout

The layout **must remain identical on every screen.**

```
---------------------------------------------------------
|                 Header                                |
---------------------------------------------------------
|          |                      |                     |
|          |                      |                     |
| Left     |      Main Area       |  AI Assistant      |
| Sidebar  |   (Scrollable)       |   (Fixed)          |
|          |                      |                     |
|          |                      |                     |
---------------------------------------------------------
```

---

# Left Sidebar (Collapsible)

Inspired by DigiLocker.

Must stay fixed.

Include:

* Saarthi AI logo
* Home
* My Applications
* Schemes
* Documents
* Notifications
* Profile
* Settings
* Help
* Logout

Top-left hamburger button should expand/collapse the sidebar.

Collapsed state shows icons only.

Expanded state shows icon + label.

---

# Header

Minimal.

Top right:

* Language dropdown
* User profile
* Notification icon

No search bar.

---

# Right AI Assistant Panel (Always Visible)

This panel never changes position.

Width approximately 340–380px.

Three stacked sections.

---

## Section 1

Small horizontal card.

Contains

Speaker icon

Read Out

Audio animation

Height around 60px.

---

## Section 2

Large Voice Assistant card.

Largest component on right panel.

Contains

Large circular microphone

Animated waveform

Status text

Examples

Listening...

Speak now

Processing...

Understanding...

Ready

Stop button

Type instead button

This microphone should remain visible during every screen of the workflow.

Only its state changes.

---

## Section 3

AI Assistant Suggestions

Instead of generic FAQs, make this contextual.

Depending on workflow stage show cards like

Find schemes for crop damage

Check application status

Missing documents

Why this scheme?

What happens next?

Can I help fill this form?

Each suggestion is a clickable rounded card with icon.

---

# Main Area (Scrollable)

IMPORTANT

Only the middle section should scroll.

Sidebar and AI panel remain fixed.

The scroll contains the entire workflow.

---

# Workflow

Convert the original mobile flow into desktop cards.

Each stage occupies approximately one screen height.

Use large icons instead of text.

Workflow should look like

🎤

↓

🧠

↓

📍

↓

🏛️

↓

📄

↓

✅

Each stage should use

Large icon

Circular progress

Short title

One-line description

Very little text

Animated completion

---

# Prototype Screens

Create all of the following pages.

---

## 1. Home

Greeting

Voice assistant ready

Categories

Recent applications

Quick actions

---

## 2. Listening

Microphone active

Live waveform

Live transcript

Large centered microphone animation

---

## 3. Understanding

Progress tracker

AI extracting

Location

Farmer

Crop

Problem

Show animated workflow

Listening ✓

Understanding ✓

Identifying...

Finding schemes...

---

## 4. Confirmation

AI displays extracted information.

Farmer

Location

Crop

Problem

Large confirmation cards

Buttons

Confirm

Edit

---

## 5. Matching Schemes

Three government schemes

Ranked

Large cards

Match percentage

Benefits

Eligibility

View Details

---

## 6. Scheme Details

Benefits

Eligibility

Estimated benefit

Application mode

Required documents

Interactive document checklist

Continue button

---

## 7. Missing Document Guidance

Timeline

Step-by-step visual guide

Office location

Fee

Required papers

Progress tracker

Navigate button

---

## 8. Voice Application Filling

Question progress

Voice input

Large microphone

Progress bar

Question cards

AI fills application automatically

---

## 9. Review Application

Editable summary

Application details

Read Back button

Confirm & Submit

---

## 10. Submission Success

Success animation

Application ID

Status

Estimated timeline

Download receipt

Go to Applications

---

# Animations

Prototype interactions should include

Sidebar collapse

Workflow progress

Microphone pulse

Wave animation

Card hover

Smooth page transitions

Progress completion

Loading shimmer

Voice animation

Button hover

---

# Dummy Data

Use hardcoded information.

Farmer Name

Ramesh Kumar

Location

Thanjavur, Tamil Nadu

Crop

Paddy

Problem

Heavy rain crop damage

Suggested schemes

PM Fasal Bima Yojana

PM Kisan Samman Nidhi

State Disaster Relief

Documents

Aadhaar

Income Certificate

Bank Passbook

Land Ownership Proof

Application ID

PMFBY2024-258741

---

# Important Design Rules

* Keep the **left sidebar fixed** and collapsible.
* Keep the **right AI assistant panel fixed and always visible**.
* Only the **middle content scrolls**.
* Use **icons more than text**.
* Make the workflow the visual focus.
* Ensure all 10 screens follow the same layout for consistency.
* Use placeholder data only; no backend integration required.

---

I think this structure is stronger than the original mobile flow because it uses the extra desktop space effectively. The user always knows **where they are (center), what the AI is doing (right), and how to navigate (left)**, which makes the experience feel much more like a modern productivity application than a traditional government portal.
