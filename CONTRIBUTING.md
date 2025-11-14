# Contributing to Code Intelligence MCP

Thank you for your interest in contributing to Code Intelligence MCP! We welcome contributions from the community.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:

1. **Search existing issues** to avoid duplicates
2. **Open a new issue** with a clear title and description
3. **Provide details**:
   - For bugs: steps to reproduce, expected vs actual behavior, environment info
   - For features: use case, proposed solution, potential impact

### Submitting Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Setup your development environment**:

   ```bash
   pnpm install
   cp data/config.example.json data/config.json
   # Configure your API keys in data/config.json
   ```

3. **Make your changes**:
   - Write clear, concise code following our coding standards
   - Add tests if applicable
   - Update documentation as needed

4. **Test your changes**:

   ```bash
   pnpm type-check
   pnpm lint
   pnpm format:check
   ```

5. **Commit your changes**:
   - Use clear, descriptive commit messages
   - Follow conventional commit format: `type(scope): description`
   - Examples: `feat(suggester): add new recommendation algorithm`, `fix(config): handle missing API key`

6. **Submit the pull request**:
   - Provide a clear description of the changes
   - Reference any related issues
   - Ensure all checks pass

## Development Guidelines

### Code Style

- **Language**: TypeScript with strict mode enabled
- **Formatting**: Use Prettier (runs automatically via Husky)
- **Linting**: Follow ESLint rules
- **Naming conventions**:
  - Files: kebab-case (`ai-suggester.ts`)
  - Classes: PascalCase (`AISuggester`)
  - Functions/variables: camelCase (`getSuggestions`)
  - Constants: UPPER_SNAKE_CASE (`DEFAULT_MODEL`)

### Project Structure

```
src/
├── core/       # Core business logic
├── config/     # Configuration management
├── tools/      # MCP tools implementation
├── resources/  # MCP resources
├── types/      # Type definitions
└── utils/      # Utility functions
```

### Commit Message Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Testing

- Write unit tests for new features
- Ensure existing tests pass before submitting PR
- Test with different AI models when applicable

### Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for public APIs
- Update configuration examples if needed

## Code Review Process

1. Maintainers will review your PR within a few days
2. Address any requested changes
3. Once approved, maintainers will merge your PR

## Questions?

Feel free to open an issue for any questions about contributing.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
