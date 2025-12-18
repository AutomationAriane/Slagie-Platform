1. Must-have functionaliteit voor de launch
Voordat het platform live gaat, moet de "Antigravity" ervaring (frictieloos en betrouwbaar) voor 100% gegarandeerd zijn op de volgende punten:
	• Geautomatiseerde Data Ingestie: Het systeem moet de xlsx foutloos kunnen inlezen, inclusief de mapping van complexe kolommen zoals CBR Thema en Vraagtype (Ja/Nee vs. Meerkeuze).
	• Volwaardige CBR-Examensimulatie: De mogelijkheid om een set van 50 vragen te genereren in de juiste verhouding (Gevaarherkenning, Kennis, Inzicht) conform CBR-richtlijnen.
	• Data-Aware AI Tutor: De chatbot moet bij elke foutieve beantwoording direct de correcte uitleg uit de excel en kolom Antwoord kunnen extraheren en verrijken met motiverende feedback.
	• Individuele Voortgangstracking: Een dashboard dat per gebruiker bijhoudt welke thema's (bijv. "Voorrang" of "Wetgeving") beheerst worden en welke nog extra training nodig hebben.
	• PWA Installatie: De app moet via de browser installeerbaar zijn op het startscherm van een telefoon zonder tussenkomst van een App Store.
2. Kwaliteitsverwachting (Polished MVP)
Hoewel we de KISS (Keep It Simple, Stupid) filosofie hanteren, moet het platform voor de eindgebruiker aanvoelen als een "Polished MVP".
	• Visuele Rust: De interface moet de rustige, moderne uitstraling spiegelen (veel whitespace, duidelijke typografie) om studie-focus te bevorderen.
	• Artifact Rendering: Vragen mogen niet als platte tekst in de chat verschijnen, maar moeten als interactieve kaarten ("Artifacts") in een zijpaneel of overlay worden getoond voor een professionele uitstraling.
	• Snelheid: Streaming antwoorden van de AI moeten onmiddellijk starten (geen lange laadbalken), zodat het gesprek natuurlijk aanvoelt.
3. Successtatistieken (Wanneer is het een succes?)
We beschouwen de app als succesvol wanneer de volgende KPI's worden behaald:
Metric	Doelstelling (Succes)
Slagingspercentage	> 85% van de gebruikers die de "Exam Simulation" drie keer halen, slagen in één keer bij het echte CBR.
User Retention	Gebruikers komen gemiddeld 4x per week terug tot aan hun examendatum.
Conversie (PWA)	Minimaal 40% van de actieve gebruikers installeert de app op hun startscherm.
Data Integriteit	0% fouten in de AI-uitleg vergeleken met de "Ground Truth" in de Examens.csv.

Van <https://gemini.google.com/app/8a4458a19053c212?hl=nl> 


 Hi! I'm here to help you create a detailed specification for your app.

  Let's start with the basics:
  1. What do you want to call this project?
  2. In your own words, what are you building?
  3. Who will use it - just you, or others too?

> 1. What do you want to call this project?
Project Name: Slagie Theorie

2. In your own words, what are you building?
Detailed Description: I am building an intelligent, data-driven study platform 
specifically designed for the Dutch CBR Driving Theory Exam (Auto). Unlike standard      
quiz apps, this is an Autonomous Agentic System that acts as a proactive personal        
tutor.

The core of the system is built around a specific dataset (TheorieToppers examen         
vragen (3).xlsx) which serves as the "Ground Truth". The application ingests this        
data to power in a learndash environment for the admin and a perfect learning 
platform for the students.

Key Functional Components:

Data Ingestion Engine: A backend pipeline that automatically parses the provided         
TheorieToppers examen vragen (3).xlsx file, validates the integrity of questions,        
answers, and options, and seeds a SQLite database. This ensures the agent always         
trains with the correct, specific curriculum.

Agentic Tutor Logic: An AI Agent that doesn't just display questions but actively        
"teaches". It engages in a chat interface, presents questions (both text and 
image-based), recognizes natural language answers (e.g., "I think it's A" or "Yes,       
because..."), and provides immediate, context-aware feedback. If a student answers       
incorrectly, the agent explains why based on the official answer provided in the         
dataset.

Adaptive Study Modes: The app features distinct modes to prevent study fatigue:

Exam Simulation: Replicates the official CBR mix (Gevaarherkenning, Kennis, Inzicht).    

Topic Focus: Filters questions dynamically based on metadata columns like "CBR Thema"    
 or "Onderwerp" (e.g., "Verkeerstekens" or "Voorrang").

Survival Mode: An infinite stream of questions that ends only after 3 mistakes, 
designed for gamified rapid-fire learning.

Mistake Review: A targeted session revisiting previously incorrect answers using         
Spaced Repetition logic.

Dynamic Artifacts: To separate the "Chat" from the "Study Material," the agent 
renders visual components in a side panel (Artifacts), such as interactive Exam Cards    
 (Question + Options + Image), Progress Graphs (visualizing weak spots per topic),       
and AI-generated "Cheat Sheets" summarizing difficult rules.

Goal: To create a "frictionless" learning environment where the student feels like       
they have a private instructor 24/7, maximizing their pass rate through personalized,    
 data-backed training.

3. Who will use it - just you, or others too?
Target Audience & User Roles: This platform is designed for public use (B2C), 
specifically targeting:

Primary Users (Students): Individuals preparing for their CBR Auto Theory Exam in the    
 Netherlands. These users range  (16-50) getting their first license to adults 
needing a refresher. They require an interface that is mobile-friendly, engaging, and    
 extremely simple to navigate (high "Antigravity" factor).

Needs: Clear progress tracking, motivating feedback, instant clarity on mistakes, and    
 the ability to train in short bursts on their phone.

System Administrator (Me/Automated): An administrative role (mostly automated via        
scripts) responsible for updating the TheorieToppers examen vragen (3).xlsx source       
file when traffic rules change, ensuring the database stays current without manual       
data entry.

Scale: The architecture is built to support multiple concurrent users, each with         
their own isolated progress tracking (user_progress table) and study history 
(study_sessions table), allowing for personalized analytics per user. 

1. Must-have functionaliteit voor de launch
Voordat het platform live gaat, moet de "Antigravity" ervaring (frictieloos en betrouwbaar) voor 100% gegarandeerd zijn op de volgende punten:
	• Geautomatiseerde Data Ingestie: Het systeem moet de xlsx foutloos kunnen inlezen, inclusief de mapping van complexe kolommen zoals CBR Thema en Vraagtype (Ja/Nee vs. Meerkeuze).
	• Volwaardige CBR-Examensimulatie: De mogelijkheid om een set van 50 vragen te genereren in de juiste verhouding (Gevaarherkenning, Kennis, Inzicht) conform CBR-richtlijnen.
	• Data-Aware AI Tutor: De chatbot moet bij elke foutieve beantwoording direct de correcte uitleg uit de excel en kolom Antwoord kunnen extraheren en verrijken met motiverende feedback.
	• Individuele Voortgangstracking: Een dashboard dat per gebruiker bijhoudt welke thema's (bijv. "Voorrang" of "Wetgeving") beheerst worden en welke nog extra training nodig hebben.
	• PWA Installatie: De app moet via de browser installeerbaar zijn op het startscherm van een telefoon zonder tussenkomst van een App Store.
2. Kwaliteitsverwachting (Polished MVP)
Hoewel we de KISS (Keep It Simple, Stupid) filosofie hanteren, moet het platform voor de eindgebruiker aanvoelen als een "Polished MVP".
	• Visuele Rust: De interface moet de rustige, moderne uitstraling spiegelen (veel whitespace, duidelijke typografie) om studie-focus te bevorderen.
	• Artifact Rendering: Vragen mogen niet als platte tekst in de chat verschijnen, maar moeten als interactieve kaarten ("Artifacts") in een zijpaneel of overlay worden getoond voor een professionele uitstraling.
	• Snelheid: Streaming antwoorden van de AI moeten onmiddellijk starten (geen lange laadbalken), zodat het gesprek natuurlijk aanvoelt.
3. Successtatistieken (Wanneer is het een succes?)
We beschouwen de app als succesvol wanneer de volgende KPI's worden behaald:
Metric	Doelstelling (Succes)
Slagingspercentage	> 85% van de gebruikers die de "Exam Simulation" drie keer halen, slagen in één keer bij het echte CBR.
User Retention	Gebruikers komen gemiddeld 4x per week terug tot aan hun examendatum.
Conversie (PWA)	Minimaal 40% van de actieve gebruikers installeert de app op hun startscherm.
Data Integriteit	0% fouten in de AI-uitleg vergeleken met de "Ground Truth" in de Examens.csv.

Van <https://gemini.google.com/app/8a4458a19053c212?hl=nl> 


 Hi! I'm here to help you create a detailed specification for your app.

  Let's start with the basics:
  1. What do you want to call this project?
  2. In your own words, what are you building?
  3. Who will use it - just you, or others too?

> 1. What do you want to call this project?
Project Name: Slagie Theorie

2. In your own words, what are you building?
Detailed Description: I am building an intelligent, data-driven study platform 
specifically designed for the Dutch CBR Driving Theory Exam (Auto). Unlike standard      
quiz apps, this is an Autonomous Agentic System that acts as a proactive personal        
tutor.

The core of the system is built around a specific dataset (TheorieToppers examen         
vragen (3).xlsx) which serves as the "Ground Truth". The application ingests this        
data to power in a learndash environment for the admin and a perfect learning 
platform for the students.

Key Functional Components:

Data Ingestion Engine: A backend pipeline that automatically parses the provided         
TheorieToppers examen vragen (3).xlsx file, validates the integrity of questions,        
answers, and options, and seeds a SQLite database. This ensures the agent always         
trains with the correct, specific curriculum.

Agentic Tutor Logic: An AI Agent that doesn't just display questions but actively        
"teaches". It engages in a chat interface, presents questions (both text and 
image-based), recognizes natural language answers (e.g., "I think it's A" or "Yes,       
because..."), and provides immediate, context-aware feedback. If a student answers       
incorrectly, the agent explains why based on the official answer provided in the         
dataset.

Adaptive Study Modes: The app features distinct modes to prevent study fatigue:

Exam Simulation: Replicates the official CBR mix (Gevaarherkenning, Kennis, Inzicht).    

Topic Focus: Filters questions dynamically based on metadata columns like "CBR Thema"    
 or "Onderwerp" (e.g., "Verkeerstekens" or "Voorrang").

Survival Mode: An infinite stream of questions that ends only after 3 mistakes, 
designed for gamified rapid-fire learning.

Mistake Review: A targeted session revisiting previously incorrect answers using         
Spaced Repetition logic.

Dynamic Artifacts: To separate the "Chat" from the "Study Material," the agent 
renders visual components in a side panel (Artifacts), such as interactive Exam Cards    
 (Question + Options + Image), Progress Graphs (visualizing weak spots per topic),       
and AI-generated "Cheat Sheets" summarizing difficult rules.

Goal: To create a "frictionless" learning environment where the student feels like       
they have a private instructor 24/7, maximizing their pass rate through personalized,    
 data-backed training.

3. Who will use it - just you, or others too?
Target Audience & User Roles: This platform is designed for public use (B2C), 
specifically targeting:

Primary Users (Students): Individuals preparing for their CBR Auto Theory Exam in the    
 Netherlands. These users range  (16-50) getting their first license to adults 
needing a refresher. They require an interface that is mobile-friendly, engaging, and    
 extremely simple to navigate (high "Antigravity" factor).

Needs: Clear progress tracking, motivating feedback, instant clarity on mistakes, and    
 the ability to train in short bursts on their phone.

System Administrator (Me/Automated): An administrative role (mostly automated via        
scripts) responsible for updating the TheorieToppers examen vragen (3).xlsx source       
file when traffic rules change, ensuring the database stays current without manual       
data entry.

Scale: The architecture is built to support multiple concurrent users, each with         
their own isolated progress tracking (user_progress table) and study history 
(study_sessions table), allowing for personalized analytics per user. 

● This is an impressive and well-thought-out project! You've clearly done your homework on what makes an effective learning platform. I love the concept of an "Agentic Tutor" that actively teaches rather than just quizzes, and the different study modes (especially Survival Mode) sound engaging.

  Let me make sure I understand the core vision:
  - Data-driven: Everything powered by the TheorieToppers Excel file as the source of truth
  - AI-powered chat tutor: Natural language interaction, not just clicking buttons       
  - Multi-modal: Text questions, images, and dynamic visual artifacts in a side panel    
  - Gamified: Survival mode, progress tracking, spaced repetition to keep students motivated
  - Mobile-first: Needs to work great on phones for study-on-the-go

  Now let me understand how you'd like to work through the technical details:

● User answered Claude's questions:
  ⎿  · How involved do you want to be in technical decisions (database schema, API       
     design, architecture)? → Quick Mode (Recommended)

● Quick Mode it is. I'll handle all the technical architecture based on what you describe.

  Let me get a sense of scale and complexity:

● User answered Claude's questions:
  ⎿  · Based on your description, this sounds like a Complex app. Does this match        
     your vision? → Full Enterprise
     · Roughly how many distinct features do you envision? → 300+ features
     · Any technology preferences, or should I choose sensible defaults? → Use
     defaults (Recommended)

● Full Enterprise with 300+ features - ambitious! This will be a comprehensive platform. I'll use React, Node.js, and SQLite as the foundation.

  Now let's dive deep into the features. Let me quickly check which major areas apply:   

● User answered Claude's questions:
  ⎿  · Will you have paid subscriptions or is it free for students? → Paid
     subscriptions
     · You mentioned 'instructor dashboards' - will driving schools use this too? →      
     Yes, driving schools
     · Multiple exam types beyond Auto? → Full range
     · Do you need the AI tutor to use an actual LLM (like GPT/Claude) or rule-based     
     responses? → Hybrid approach


● Excellent choices! This is a full-featured enterprise platform:
  - Paid subscriptions with billing
  - B2B for driving schools
  - All exam types (Auto, Motor, Bromfiets, Tractor, etc.)
  - Hybrid AI (smart rules + LLM when needed)

  Now let's dive into the heart of the app - the student learning experience.

  Walk me through what happens when a student first opens the app. What do they see? What's the first thing they do?

  Also, let's clarify your study modes:

● User answered Claude's questions:
  ⎿  · For Exam Simulation mode - should it exactly mirror the real CBR exam format?     
     → Both options

     · For the chat interface with the AI tutor - is this the PRIMARY way students       
     interact, or alongside traditional buttons? → Traditional + AI assist

● Clear - so it's a traditional quiz interface where the AI tutor appears contextually (when wrong, confused, or asking for help). This is a great UX choice - familiar format with smart assistance.

  Let me understand more about the learning flow:

● User answered Claude's questions:
  ⎿  · When a new student signs up, is there an onboarding flow? → Quick tutorial        
     · What gamification elements do you want? → Motivational only
     · Should students be able to interact with each other? → No social features

● Focused on learning - I like it. Motivational elements without the complexity of social features.

  Let me dig into a few more student experience details:

● User answered Claude's questions:
  ⎿  · What progress analytics should students see? → Comprehensive dashboard
     · Should the app work offline (downloaded questions)? → Online only
     · Push notifications and reminders? → Smart reminders

● Excellent - comprehensive analytics with smart reminders. Students will have great visibility into their progress.

  Now let's define the subscription and payment model:

● User answered Claude's questions:
  ⎿  · What subscription tiers do you want? → Trial + Paid only
     · Billing frequency options? → one price per exam bronze, silver, gold packages     
     · Which payment processor? → Mollie

● Interesting pricing model! Let me make sure I understand the bronze, silver, gold packages per exam:

● User answered Claude's questions:
  ⎿  · What differentiates Bronze, Silver, Gold packages? → Brons pakket: €44,99, 7      
     dagen toegang, 5 CBR-examenmodules.

     Zilver pakket: €54,99, 21 dagen toegang, 7 CBR-examenmodules.

     Goud pakket: €64,99, 31 dagen toegang, 10 CBR-examenmodules.
     · Is this a one-time purchase per exam type, or recurring? → One-time purchase      

● Crystal clear pricing:
  - Brons: €44.99 / 7 dagen / 5 modules
  - Zilver: €54.99 / 21 dagen / 7 modules
  - Goud: €64.99 / 31 dagen / 10 modules
  - One-time purchase via Mollie

  Now let's detail the driving school (B2B) features:

● User answered Claude's questions:
  ⎿  · How do driving schools purchase access for their students? → all the options      
     except 4
     · Can driving schools customize their instance? → No customization
     · What can instructors/schools see about their students? → Detailed analytics       

● Flexible B2B billing options - that's smart for different school sizes. No white-labeling keeps it simpler while still providing detailed student analytics.

  A few more B2B questions:

● User answered Claude's questions:
  ⎿  · Can instructors interact with students through the platform? → No direct
     communication
     · Can instructors assign specific content to students? → No assignments
     · Can schools add their own questions to the database? → No, official content       
     only

● So B2B is monitoring-focused - schools enroll students, track progress with detailed analytics, but students study independently. Clean and simple.

  Now let's cover multi-exam type support. You mentioned Auto, Motor, Bromfiets, Tractor, etc.

● User answered Claude's questions:
  ⎿  · Do different exam types share questions, or are they completely separate? →       
     Shared core + unique
     · Will you have separate Excel files per exam type, or one master file? →
     Separate files
     · Can a student study for multiple exams simultaneously? → Yes, purchase
     separately

● Clear structure - shared core questions with exam-specific additions, separate data files, and flexible multi-exam purchases.

  Now let's define admin/system features:

● User answered Claude's questions:
  ⎿  · How should new question data be imported? → Both options and admin can change     
     questions with learndash kind of options the pages should also support video        
     (.mp4 & url) for explanation

     · What business analytics do YOU need as the platform owner? → Comprehensive        
     · User management capabilities? → Full control

● The LearnDash-style admin is a great addition - so the platform needs a full content management system for questions, not just file imports. Let me clarify this:

● User answered Claude's questions:
  ⎿  · For the LearnDash-style question editor, what should admins be able to do? →      
     Full CRUD + rich media
     · Should video explanations be part of every question or just some? → Both
     levels

● Full LMS-style admin - that's powerful. Now let's nail down security and access control:

● User answered Claude's questions:
  ⎿  · What authentication methods should users have? → Email + Social
     · How should user roles be structured? → 4 roles
     · What security measures for payments and sensitive actions? → Maximum security     

● Strong security posture. Let me clarify the 4 roles:

● User answered Claude's questions:
  ⎿  · What can an Instructor do that a Student cannot? → View assigned students
     · What can a School Owner do that an Instructor cannot? → Billing + instructor      
     management

● Clear role hierarchy:
  1. Student - Studies, views own progress
  2. Instructor - Views assigned students' progress (read-only)
  3. School Owner - Billing, manages instructors for their school
  4. Platform Admin - Everything (content CMS, users, analytics)

  Let me cover a few more important areas:

● User answered Claude's questions:
  ⎿  · When a student's package expires, what happens? → Graceful degradation
     · Should the app be available as a mobile app or web-only? → PWA
     · Language support? → 2 & 3

● Excellent! Graceful degradation keeps users engaged, PWA gives app-like experience without app store hassle, and multi-language architecture is future-proof.

  One final question before I summarize:

  What does "done" look like for you? When would you consider this app complete and successful?

  Think about:
  - Must-have functionality before launch
  - Quality expectations (polished vs functional MVP)
  - Any specific success metrics

> 1. Must-have functionaliteit voor de launch
Voordat het platform live gaat, moet de "Antigravity" ervaring (frictieloos en 
betrouwbaar) voor 100% gegarandeerd zijn op de volgende punten:
    • Geautomatiseerde Data Ingestie: Het systeem moet de xlsx foutloos kunnen 
inlezen, inclusief de mapping van complexe kolommen zoals CBR Thema en Vraagtype         
(Ja/Nee vs. Meerkeuze).
    • Volwaardige CBR-Examensimulatie: De mogelijkheid om een set van 50 vragen te       
genereren in de juiste verhouding (Gevaarherkenning, Kennis, Inzicht) conform 
CBR-richtlijnen.
    • Data-Aware AI Tutor: De chatbot moet bij elke foutieve beantwoording direct de     
correcte uitleg uit de excel en kolom Antwoord kunnen extraheren en verrijken met        
motiverende feedback.
    • Individuele Voortgangstracking: Een dashboard dat per gebruiker bijhoudt welke     
thema's (bijv. "Voorrang" of "Wetgeving") beheerst worden en welke nog extra training    
 nodig hebben.
    • PWA Installatie: De app moet via de browser installeerbaar zijn op het 
startscherm van een telefoon zonder tussenkomst van een App Store.
2. Kwaliteitsverwachting (Polished MVP)
Hoewel we de KISS (Keep It Simple, Stupid) filosofie hanteren, moet het platform voor    
 de eindgebruiker aanvoelen als een "Polished MVP".
    • Visuele Rust: De interface moet de rustige, moderne uitstraling spiegelen (veel    
 whitespace, duidelijke typografie) om studie-focus te bevorderen.
    • Artifact Rendering: Vragen mogen niet als platte tekst in de chat verschijnen,     
maar moeten als interactieve kaarten ("Artifacts") in een zijpaneel of overlay worden    
 getoond voor een professionele uitstraling.
    • Snelheid: Streaming antwoorden van de AI moeten onmiddellijk starten (geen         
lange laadbalken), zodat het gesprek natuurlijk aanvoelt.
3. Successtatistieken (Wanneer is het een succes?)
We beschouwen de app als succesvol wanneer de volgende KPI's worden behaald:
Metric    Doelstelling (Succes)
Slagingspercentage    > 85% van de gebruikers die de "Exam Simulation" drie keer         
halen, slagen in één keer bij het echte CBR.
User Retention    Gebruikers komen gemiddeld 4x per week terug tot aan hun 
examendatum.
Conversie (PWA)    Minimaal 40% van de actieve gebruikers installeert de app op hun      
startscherm.
Data Integriteit    0% fouten in de AI-uitleg vergeleken met de "Ground Truth" in de     
Examens.csv. 

● Uitstekend! Duidelijke, meetbare succescriteria. Je hebt echt goed nagedacht over wat succes betekent.

  Let me now present the complete specification summary for your review:

  ---
  📋 SLAGIE THEORIE - SPECIFICATION SUMMARY

  Project Overview

  An intelligent, data-driven study platform for Dutch CBR Driving Theory Exams. Features an AI-powered agentic tutor, multiple study modes, and enterprise B2B capabilities for driving schools. Built as a PWA for frictionless mobile learning.

  Technology Stack (Defaults)

  - Frontend: React + PWA capabilities
  - Backend: Node.js
  - Database: SQLite
  - Payments: Mollie
  - AI: Hybrid (rule-based + LLM API for complex explanations)

  Complexity & Scale

  - Tier: Enterprise/Complex
  - Target Features: 400+ tests
  - Multi-exam support: Auto, Motor, Bromfiets, Tractor, etc.

  ---
  User Roles (4 levels)

  | Role           | Permissions                                                  |      
  |----------------|--------------------------------------------------------------|      
  | Student        | Study, view own progress, manage account, install PWA        |      
  | Instructor     | View assigned students' progress (read-only)                 |      
  | School Owner   | Billing, manage instructors, school analytics                |      
  | Platform Admin | Full CMS, user management, business analytics, impersonation |      

  ---
  Core Features

  🎓 Study Modes
  - Exam Simulation (official CBR replica: 50 questions, Gevaarherkenning/Kennis/Inzicht ratio)
  - Practice Mode (configurable question count, optional timer)
  - Topic Focus (filter by CBR Thema, Onderwerp)
  - Survival Mode (infinite stream, 3 strikes = out)
  - Mistake Review (spaced repetition logic)

  🤖 AI Tutor
  - Traditional quiz UI with AI assist (appears when wrong/stuck)
  - Extracts correct answer from Excel "Antwoord" column
  - Motivational, context-aware feedback
  - Streaming responses for natural feel

  📊 Student Dashboard
  - Comprehensive analytics (weak topics, predicted pass rate, time spent)
  - Progress graphs per CBR Thema
  - Study recommendations
  - Streak tracking

  🎨 Artifacts (Side Panel)
  - Interactive exam cards (question + options + image)
  - Progress visualizations
  - AI-generated cheat sheets
  - Video explanations (MP4 + URL support)

  ---
  Pricing Model (One-time purchase per exam)

  | Package | Price  | Duration | Modules        |
  |---------|--------|----------|----------------|
  | Brons   | €44.99 | 7 dagen  | 5 CBR modules  |
  | Zilver  | €54.99 | 21 dagen | 7 CBR modules  |
  | Goud    | €64.99 | 31 dagen | 10 CBR modules |

  - Graceful degradation on expiry (limited access)
  - Mollie payment processing (iDEAL support)

  ---
  B2B / Driving Schools

  - Billing options: Bulk licenses, per-student, school subscription
  - No white-labeling (same branding for all)
  - Detailed student analytics for instructors/owners
  - Monitoring-focused (no assignments, no messaging)

  ---
  Admin Panel (LearnDash-style)

  - Full CRUD for questions with rich media editor
  - Image and video attachments (topic-level + per-question)
  - Excel import UI + automated pipeline
  - Comprehensive business analytics (revenue, churn, cohorts)
  - Full user management (edit, delete, impersonate)
  - Audit logging

  ---
  Data Architecture

  - Separate Excel files per exam type
  - Shared core questions + exam-specific questions
  - Key columns: CBR Thema, Onderwerp, Vraagtype (Ja/Nee vs Meerkeuze), Antwoord

  ---
  Security

  - Auth: Email/password + Social (Google, Facebook, Apple)
  - Maximum security: 2FA, rate limiting, suspicious activity alerts, audit logs
  - HTTPS, password hashing, CSRF, email verification

  ---
  Platform & Localization

  - PWA (installable, works like native)
  - Languages: Dutch + English, multi-language ready architecture
  - Online-only (no offline mode)
  - Smart notifications: Streaks, spaced repetition reminders, exam countdown

  ---
  Success Criteria

  | Metric         | Target                                                        |     
  |----------------|---------------------------------------------------------------|     
  | Pass rate      | >85% of users who pass simulation 3x, pass real CBR first try |     
  | Retention      | 4x/week until exam date                                       |     
  | PWA install    | 40%+ of active users                                          |     
  | Data integrity | 0% errors vs ground truth                                     |     

  Quality Standards

  - Visual calm (whitespace, clean typography)
  - Artifact rendering (no plain text questions)
  - Streaming AI (instant response start)
  - "Antigravity" UX (frictionless)

