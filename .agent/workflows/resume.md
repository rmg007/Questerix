---
description: Continue work from previous session
---

// turbo-all

# /resume - Continue Previous Work

**Purpose**: Pick up where the last session left off.

---

## Instructions

// turbo
1. **Check for session state files**: `.session/*.md`
2. **Check git status**: Any uncommitted changes?
3. **Check PHASE_STATE.json**: Current phase?
4. **Summarize what was done** and what remains
5. **Continue execution**

---

## Auto-Detection Strategy

### Priority 1: Session State Files
```powershell
Get-ChildItem -Path ".session/*.md" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
```

### Priority 2: Git Status
```powershell
git status --porcelain
git diff --stat
```

### Priority 3: PHASE_STATE.json
```powershell
Get-Content PHASE_STATE.json | ConvertFrom-Json
```

### Priority 4: Ask User
If no context found, ask:
> "What were we working on? Provide task description or issue number."

---

## Output Format

```markdown
## Resuming Work

### Session Detection
- **Source**: [.session file / git status / PHASE_STATE.json / user input]
- **Last Activity**: [timestamp if available]

---

### Last Session State
| Field | Value |
|-------|-------|
| Phase | [intake/plan/implement/verify/blocked] |
| Task | [Description] |
| Status | [in_progress/blocked/ready_for_verify] |

---

### Completed
- [x] [Completed item 1]
- [x] [Completed item 2]

### Remaining
- [ ] [Remaining item 1]
- [ ] [Remaining item 2]

---

### Continuing With
[What will be done next]

### Next Command
[The specific action being taken now]
```

---

## Session State File Format

If creating a session file for later resume:

**Location**: `.session/[YYYY-MM-DD]-[task-slug].md`

```markdown
---
status: in_progress  # in_progress | blocked | completed
phase: implement     # intake | plan | implement | verify | docs | pr
task: Add skill selection widget
started_at: 2026-02-03T07:30:00
updated_at: 2026-02-03T08:45:00
blocker: null        # or description of blocker
---

## Task Summary
[1-2 sentence description]

## Acceptance Criteria
- [x] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Files Changed
- `lib/widgets/skill_widget.dart` — Created
- `lib/routes.dart` — Modified

## Next Steps
1. Write unit tests
2. Run /verify
3. Update docs if needed

## Context Notes
[Any important context for resuming]
```

---

## Cleanup

After task completion:
```powershell
# Archive completed session files
Move-Item ".session/2026-02-03-*.md" ".session/archive/" -Force
```

---

## Resume Examples

### Example 1: From Session File
```markdown
## Resuming Work

### Session Detection
- Source: `.session/2026-02-03-skill-widget.md`
- Last Activity: 2026-02-03T08:45:00

### Last Session State
| Field | Value |
|-------|-------|
| Phase | implement |
| Task | Add skill selection widget |
| Status | in_progress |

### Completed
- [x] Created widget skeleton
- [x] Added routing

### Remaining
- [ ] Write unit tests
- [ ] Run verification

### Continuing With
Writing unit tests for SkillWidget...
```

### Example 2: From Git Status
```markdown
## Resuming Work

### Session Detection
- Source: git status (uncommitted changes detected)
- Files modified: 3

### Uncommitted Changes
- `lib/widgets/skill_widget.dart` (modified)
- `lib/routes.dart` (modified)
- `test/skill_widget_test.dart` (new)

### Likely Task
Based on changes: "Adding skill selection widget"

### Continuing With
Running /verify to check current state...
```
