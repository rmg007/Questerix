# Math7 Domain

Shared domain logic and data models for the Math7 ecosystem (Student App & Admin Panel).

## Models

- **User**: Represents a student account.
    - `id`: Unique identifier (matches Auth UID).
    - `email`: Parent or Student email (depends on age).
    - `ageGroup`: `under13` or `over13`.
    - `isParentManaged`: Flag for Under 13 accounts requiring parent approval.
- **Domain**: A curriculum domain (e.g., "Algebra").
- **Skill**: A specific skill within a domain.
- **Question**: A practice question with varying types (MCQ, Reorder, etc.).
- **Attempt**: A record of a user answering a question.

## Interfaces

- **AuthRepository**: Abstract interface for authentication operations.

## Usage

This package is intended to be used by both the Flutter Student App and potentially other Dart-based services. It uses `freezed` for immutable data classes.

```dart
import 'package:math7_domain/math7_domain.dart';

final user = User(
  id: '123',
  email: 'parent@example.com',
  ageGroup: UserAgeGroup.under13,
  isParentManaged: true,
  createdAt: DateTime.now(),
  updatedAt: DateTime.now(),
);
```

## 🧪 Testing

Run unit tests to verify domain logic and serialization:

```bash
flutter test
```

> **Note:** JSON serialization uses `snake_case` keys (e.g. `age_group` for `ageGroup`) to match the Supabase schema.
