# PAILOS — Agent Instructions

## Working Mode
- Always plan before coding
- Implement ONE step at a time
- Keep code minimal and runnable
- Stop after each step

## Architecture Principles
- Modular structure
- No overengineering
- JSON storage (no DB yet)
- Functions over classes (initially)

## Core Loop
Diagnose → Teach → Review → Update Memory

## Coding Rules
- Clear naming
- No magic values
- Log important steps
- Handle errors simply

## Personas
- strict: requires attempts, precise
- playful: engaging, simple
- challenger: pushes deeper thinking

## Adaptive Behavior
- if struggling → simplify + playful
- if strong → increase difficulty + challenger

## Memory Rules
- update after every session
- track:
  - skill
  - score
  - timestamp

## Goal
Build a working system first, then improve.